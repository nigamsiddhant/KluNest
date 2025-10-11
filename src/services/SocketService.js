import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentRoom = null;
    this.userInfo = null;
  }

  connect(serverUrl = 'http://103.87.173.134:3009') {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io(serverUrl, {
      transports: ['websocket'],
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentRoom = null;
      this.userInfo = null;
    }
  }

  joinRoom(userData) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    this.userInfo = userData;
    this.currentRoom = `${userData.grade}_${userData.subject}`;
    
    console.log('Joining room with data:', userData);
    this.socket.emit('user_join_room', userData);
  }

  sendMessage(message, file = null) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    if (!this.currentRoom || !this.userInfo) {
      console.error('User not in a room or user info missing');
      return;
    }

    console.log('Sending message:', message);
    const messageData = { content: message };
    if (file) {
      messageData.file = file;
    }
    this.socket.emit('chat_message', messageData);
  }

  sendTyping(isTyping) {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit('typing', isTyping);
  }

  onMessage(callback) {
    if (this.socket) {
      this.socket.on('message', callback);
    }
  }

  onChatHistory(callback) {
    if (this.socket) {
      this.socket.on('chat_history', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onChatCleared(callback) {
    if (this.socket) {
      this.socket.on('chat_cleared', callback);
    }
  }

  onConnectionStatus(callback) {
    if (this.socket) {
      this.socket.on('connect', () => callback(true));
      this.socket.on('disconnect', () => callback(false));
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  getRoomHistory(roomName) {
    return fetch(`http://103.87.173.134:3009/api/history/${roomName}`)
      .then(response => response.json())
      .catch(error => {
        console.error('Error fetching room history:', error);
        return { messages: [] };
      });
  }

  clearRoomHistory(roomName) {
    return fetch(`http://103.87.173.134:3009/api/history/${roomName}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error clearing room history:', error);
        throw error;
      });
  }

  getConnectionStatus() {
    return this.isConnected;
  }

  getCurrentRoom() {
    return this.currentRoom;
  }

  getUserInfo() {
    return this.userInfo;
  }

  async uploadFile(fileData) {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: fileData.uri,
        type: fileData.type,
        name: fileData.name,
      });

      const response = await fetch('http://103.87.173.134:3009/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      if (result.success) {
        return result.file;
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService;