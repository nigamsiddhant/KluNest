const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3009;
const CHAT_HISTORIES_DIR = path.join(__dirname, 'chat_histories');

// Store room-specific chat histories in memory
const roomHistories = new Map();

// Serve static files
app.use(express.static('public'));

// Initialize chat histories directory if it doesn't exist
function initializeChatHistoriesDir() {
  if (!fs.existsSync(CHAT_HISTORIES_DIR)) {
    fs.mkdirSync(CHAT_HISTORIES_DIR, { recursive: true });
    console.log('Created chat histories directory:', CHAT_HISTORIES_DIR);
  }
}

// Get room name from grade and subject
function getRoomName(grade, subject) {
  return `${grade}_${subject}`;
}

// Get room history file path
function getRoomHistoryFilePath(roomName) {
  return path.join(CHAT_HISTORIES_DIR, `${roomName}.json`);
}

// Initialize room history if it doesn't exist
function initializeRoomHistory(roomName) {
  if (!roomHistories.has(roomName)) {
    const roomHistory = loadRoomHistoryFromFile(roomName);
    roomHistories.set(roomName, roomHistory);
  }
}

// Load room history from file
function loadRoomHistoryFromFile(roomName) {
  const filePath = getRoomHistoryFilePath(roomName);
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error loading room history for ${roomName}:`, error);
  }
  
  // Return empty history if file doesn't exist or error occurred
  return {
    messages: [],
    lastUpdated: new Date().toISOString()
  };
}

// Load room history (from memory or file)
function loadRoomHistory(roomName) {
  if (roomHistories.has(roomName)) {
    return roomHistories.get(roomName);
  }
  
  // Load from file and store in memory
  const roomHistory = loadRoomHistoryFromFile(roomName);
  roomHistories.set(roomName, roomHistory);
  return roomHistory;
}

// Save room history to file
function saveRoomHistoryToFile(roomName, roomHistory) {
  const filePath = getRoomHistoryFilePath(roomName);
  try {
    const dataToSave = {
      messages: roomHistory.messages,
      lastUpdated: roomHistory.lastUpdated
    };
    fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2));
    console.log(`Room history saved for ${roomName}`);
  } catch (error) {
    console.error(`Error saving room history for ${roomName}:`, error);
  }
}

// Save room history (to memory and file)
function saveRoomHistory(roomName, roomHistory) {
  // Update memory
  roomHistories.set(roomName, roomHistory);
  // Save to file
  saveRoomHistoryToFile(roomName, roomHistory);
}

// Add message to room history
function addMessageToRoomHistory(roomName, message) {
  initializeRoomHistory(roomName);
  const roomHistory = roomHistories.get(roomName);
  
  roomHistory.messages.push({
    ...message,
    timestamp: new Date().toISOString()
  });
  
  // Keep only last 1000 messages per room to prevent file from getting too large
  if (roomHistory.messages.length > 1000) {
    roomHistory.messages = roomHistory.messages.slice(-1000);
  }
  
  roomHistory.lastUpdated = new Date().toISOString();
  roomHistories.set(roomName, roomHistory);
  saveRoomHistory(roomName, roomHistory);
}

// Initialize chat histories directory
initializeChatHistoriesDir();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Handle user joining a room
  socket.on('user_join_room', (userData) => {
    const { username, userType, grade, subject, user_id } = userData;
    const roomName = getRoomName(grade, subject);
    
    // Store user data in socket
    socket.username = username;
    socket.userType = userType;
    socket.grade = grade;
    socket.subject = subject;
    socket.roomName = roomName;
    socket.user_id = user_id;
    // Join the room
    socket.join(roomName);
    
    // Load and send room history
    const roomHistory = loadRoomHistory(roomName);
    console.log(`Loading history for room ${roomName}:`, roomHistory.messages.length, 'messages');
    socket.emit('chat_history', roomHistory.messages);
    
    // Notify room about new user
    const joinMessage = {
      type: 'system',
      content: `${username} (${userType}) joined the ${grade} ${subject} chat`,
      username: 'System',
      user_id: -1,
      timestamp: new Date().toISOString()
    };
    
    socket.to(roomName).emit('message', joinMessage);
    addMessageToRoomHistory(roomName, joinMessage);
    
    console.log(`${username} joined room: ${roomName}`);
  });
  
  // Handle chat messages
  socket.on('chat_message', (messageData) => {
    if (!socket.roomName || !socket.username) {
      console.log('User not properly joined to room or username missing');
      return; // User not in a room or username not set
    }
    
    const message = {
      type: 'user',
      content: messageData.content,
      username: socket.username,
      userType: socket.userType,
      user_id: socket.user_id,
      timestamp: new Date().toISOString()
    };
    
    console.log(`Message from ${socket.username} in room ${socket.roomName}: ${messageData.content}`);
    
    // Broadcast message to room members only
    io.to(socket.roomName).emit('message', message);
    
    // Save message to room history
    addMessageToRoomHistory(socket.roomName, message);
  });
  
  // Handle user typing
  socket.on('typing', (isTyping) => {
    if (!socket.roomName || !socket.username) {
      return; // User not in a room or username not set
    }
    
    socket.to(socket.roomName).emit('user_typing', {
      username: socket.username,
      isTyping: isTyping
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (socket.username && socket.roomName) {
      const leaveMessage = {
        type: 'system',
        content: `${socket.username} left the ${socket.grade} ${socket.subject} chat`,
        username: 'System',
        user_id: -1,
        timestamp: new Date().toISOString()
      };
      
      socket.to(socket.roomName).emit('message', leaveMessage);
      addMessageToRoomHistory(socket.roomName, leaveMessage);
    }
  });
});

// API endpoint to get chat history for a specific room
app.get('/api/history/:roomName', (req, res) => {
  const { roomName } = req.params;
  const roomHistory = loadRoomHistory(roomName);
  res.json(roomHistory);
});

// API endpoint to get all rooms
app.get('/api/rooms', (req, res) => {
  try {
    const files = fs.readdirSync(CHAT_HISTORIES_DIR);
    const rooms = files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
    res.json({ rooms });
  } catch (error) {
    console.error('Error getting rooms:', error);
    res.json({ rooms: [] });
  }
});

// API endpoint to clear chat history for a specific room
app.delete('/api/history/:roomName', (req, res) => {
  try {
    const { roomName } = req.params;
    const emptyRoomHistory = {
      messages: [],
      lastUpdated: new Date().toISOString()
    };
    saveRoomHistory(roomName, emptyRoomHistory);
    io.to(roomName).emit('chat_cleared');
    res.json({ success: true, message: `Chat history cleared for room ${roomName}` });
  } catch (error) {
    console.error(`Error clearing chat history for ${roomName}:`, error);
    res.status(500).json({ success: false, message: 'Error clearing chat history' });
  }
});

server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
  console.log(`Chat histories directory: ${CHAT_HISTORIES_DIR}`);
});
