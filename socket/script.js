// DOM Elements
const loginModal = document.getElementById('loginModal');
const chatInterface = document.getElementById('chatInterface');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const userTypeSelect = document.getElementById('userType');
const gradeSelect = document.getElementById('grade');
const subjectSelect = document.getElementById('subject');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messagesContainer = document.getElementById('messages');
const connectionStatus = document.getElementById('connectionStatus');
const typingIndicator = document.getElementById('typingIndicator');
const clearHistoryBtn = document.getElementById('clearHistory');
const downloadHistoryBtn = document.getElementById('downloadHistory');
const currentRoomSpan = document.getElementById('currentRoom');

// Socket.IO connection
const socket = io('http://103.87.173.134:3009');

let currentUsername = '';
let currentUserType = '';
let currentGrade = '';
let currentSubject = '';
let currentRoomName = '';
let typingTimeout;

// Connection status handling
socket.on('connect', () => {
    updateConnectionStatus(true);
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    updateConnectionStatus(false);
    console.log('Disconnected from server');
});

// Update connection status UI
function updateConnectionStatus(connected) {
    const statusElement = connectionStatus.querySelector('i');
    const statusText = connectionStatus;
    
    if (connected) {
        statusElement.className = 'fas fa-circle';
        statusText.className = 'status connected';
        statusText.innerHTML = '<i class="fas fa-circle"></i> Connected';
    } else {
        statusElement.className = 'fas fa-circle';
        statusText.className = 'status disconnected';
        statusText.innerHTML = '<i class="fas fa-circle"></i> Disconnected';
    }
}

// Update room display
function updateRoomDisplay() {
    if (currentRoomSpan) {
        currentRoomSpan.textContent = `${currentGrade} ${currentSubject} - ${currentUserType}`;
    }
}

// Login form handling
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const userType = userTypeSelect.value;
    const grade = gradeSelect.value;
    const subject = subjectSelect.value;
    const user_id = Math.random().toString(36).substring(2, 15);
    
    if (username && userType && grade && subject) {
        currentUsername = username;
        currentUserType = userType;
        currentGrade = grade;
        currentSubject = subject;
        currentRoomName = `${grade}_${subject}`;
        
        // Join the room
        const userData = {
            username: username,
            userType: userType,
            grade: grade,
            subject: subject,
            user_id: user_id,
        };
        
        console.log('Joining room with data:', userData);
        socket.emit('user_join_room', userData);
        
        // Update room display
        updateRoomDisplay();
        
        // Hide login modal and show chat interface
        loginModal.style.display = 'none';
        chatInterface.style.display = 'flex';
        
        // Enable message input
        messageInput.disabled = false;
        messageInput.nextElementSibling.disabled = false;
        messageInput.focus();
    }
});

// Message form handling
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    
    if (message) {
        console.log('Sending message:', message, 'from user:', currentUsername);
        socket.emit('chat_message', { content: message });
        messageInput.value = '';
        
        // Stop typing indicator
        socket.emit('typing', false);
    }
});

// Typing indicator
messageInput.addEventListener('input', () => {
    socket.emit('typing', true);
    
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit('typing', false);
    }, 1000);
});

// Socket event listeners
socket.on('chat_history', (messages) => {
    messages.forEach(message => {
        addMessageToUI(message);
    });
    scrollToBottom();
});

socket.on('message', (message) => {
    addMessageToUI(message);
    scrollToBottom();
});

socket.on('user_typing', (data) => {
    if (data.isTyping) {
        showTypingIndicator(data.username);
    } else {
        hideTypingIndicator();
    }
});

socket.on('chat_cleared', () => {
    messagesContainer.innerHTML = '';
    showNotification('Chat history cleared');
});

// Add message to UI
function addMessageToUI(message) {
    const messageElement = document.createElement('div');
    const isCurrentUser = message.username === currentUsername;
    const isSystemMessage = message.type === 'system';
    
    let messageClass = 'message';
    if (isSystemMessage) {
        messageClass += ' system-message';
    } else if (isCurrentUser) {
        messageClass += ' user-message';
    } else {
        messageClass += ' other-message';
    }
    
    const time = new Date(message.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Add user type badge for non-system messages
    let userTypeBadge = '';
    if (!isSystemMessage && message.userType) {
        const badgeClass = message.userType === 'teacher' ? 'teacher-badge' : 'student-badge';
        userTypeBadge = `<span class="user-type-badge ${badgeClass}">${message.userType}</span>`;
    }
    
    messageElement.className = messageClass;
    messageElement.innerHTML = `
        ${!isSystemMessage ? `<div class="message-username">${message.username} ${userTypeBadge}</div>` : ''}
        <div class="message-content">${escapeHtml(message.content)}</div>
        <div class="message-time">${time}</div>
    `;
    
    messagesContainer.appendChild(messageElement);
}

// Show typing indicator
function showTypingIndicator(username) {
    const typingText = typingIndicator.querySelector('.typing-text');
    typingText.textContent = `${username} is typing...`;
    typingIndicator.style.display = 'flex';
    scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

// Scroll to bottom of messages
function scrollToBottom() {
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

// Clear chat history
clearHistoryBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear the chat history for this room?')) {
        try {
            const response = await fetch(`/api/history/${currentRoomName}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showNotification('Chat history cleared successfully');
            } else {
                showNotification('Failed to clear chat history', 'error');
            }
        } catch (error) {
            console.error('Error clearing chat history:', error);
            showNotification('Error clearing chat history', 'error');
        }
    }
});

// Download chat history
downloadHistoryBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(`/api/history/${currentRoomName}`);
        const data = await response.json();
        
        const chatText = data.messages.map(msg => {
            const time = new Date(msg.timestamp).toLocaleString();
            const userType = msg.userType ? ` (${msg.userType})` : '';
            return `[${time}] ${msg.username}${userType}: ${msg.content}`;
        }).join('\n');
        
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat_history_${currentRoomName}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Chat history downloaded');
    } catch (error) {
        console.error('Error downloading chat history:', error);
        showNotification('Error downloading chat history', 'error');
    }
});

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        animation: slideIn 0.3s ease;
        background: ${type === 'error' ? '#dc3545' : '#28a745'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        scrollToBottom();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    scrollToBottom();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    usernameInput.focus();
});
