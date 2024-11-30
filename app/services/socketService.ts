// services/socketService.ts (Frontend)
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';
const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  autoConnect: false, // Prevent auto-connection
});

export const socketService = {
  connect: () => {
    if (!socket.connected) {
      socket.connect();
    }
  },

  disconnect: () => {
    if (socket.connected) {
      socket.disconnect();
    }
  },

  joinChat: (chatId: string) => {
    console.log('Joining chat:', chatId);
    socket.emit('join-chat', chatId);
  },

  leaveChat: (chatId: string) => {
    console.log('Leaving chat:', chatId);
    socket.emit('leave-chat', chatId);
  },

  joinAdminRoom: () => {
    console.log('Joining admin room');
    socket.emit('join-admin');
  },

  onNewMessage: (callback: (message: any) => void) => {
    socket.on('new-message', callback);
  },

  offNewMessage: () => {
    socket.off('new-message');
  },

  // Add connection event listeners
  onConnect: (callback: () => void) => {
    socket.on('connect', callback);
  },

  onDisconnect: (callback: () => void) => {
    socket.on('disconnect', callback);
  },

  onError: (callback: (error: Error) => void) => {
    socket.on('connect_error', callback);
  }
};