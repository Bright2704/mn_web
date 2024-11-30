// pages/admin/chat.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, MessageSquare } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'admin';
  timestamp: string;
  read: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  timestamp: Date;  // Add this
  unreadCount: number;
  avatar?: string;
}

const AdminChatPage = () => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to fetch all chats
  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/chats');
      const data = await response.json();
      
      const formattedUsers: ChatUser[] = data.map((chat: any) => ({
        id: chat.chat_id || '',
        name: chat.user_name || 'Unknown User',
        lastMessage: chat.lastMessage || '',
        lastMessageTime: chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleString() : '',
        timestamp: chat.lastMessageTime ? new Date(chat.lastMessageTime) : new Date(0),
        unreadCount: chat.unreadCount || 0,
      }));
  
      // Sort users by lastMessageTime in descending order with proper typing
      const sortedUsers = formattedUsers.sort((a: ChatUser, b: ChatUser) => 
        b.timestamp.getTime() - a.timestamp.getTime()
      );
  
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial setup of socket listeners and chat fetching
  useEffect(() => {
    fetchChats();

    // Listen for new messages
    socket.on('newMessage', handleNewMessage);
    
    // Listen for chat updates (new chats, deleted chats, etc.)
    socket.on('chatUpdate', fetchChats);

    // Cleanup
    return () => {
      socket.off('newMessage');
      socket.off('chatUpdate');
    };
  }, [selectedUser]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Refresh messages when selected user changes
  useEffect(() => {
    if (selectedUser) {
      fetchUserMessages(selectedUser.id);
    }
  }, [selectedUser]);

  const fetchUserMessages = async (chatId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/chats/${chatId}`);
      const data = await response.json();
      setMessages(data.messages);
      markMessagesAsRead(chatId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewMessage = (data: { chatId: string; message: ChatMessage }) => {
    // Update messages if this is the currently selected chat
    if (selectedUser?.id === data.chatId) {
      setMessages(prev => [...prev, data.message]);
      markMessagesAsRead(data.chatId);
    }

    // Update the users list with new message info
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(user =>
        user.id === data.chatId
          ? {
              ...user,
              lastMessage: data.message.content,
              lastMessageTime: new Date(data.message.timestamp).toLocaleString(),
              timestamp: new Date(data.message.timestamp),
              unreadCount: selectedUser?.id === data.chatId ? 0 : user.unreadCount + 1,
            }
          : user
      );

      // Sort users by most recent message
      return updatedUsers.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    });
  };

  const handleUserSelect = (user: ChatUser) => {
    setSelectedUser(user);
  };

  const markMessagesAsRead = async (chatId: string) => {
    try {
      await fetch(`http://localhost:5000/chats/${chatId}/read`, {
        method: 'PUT',
      });
      
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === chatId
            ? { ...user, unreadCount: 0 }
            : user
        )
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await fetch(`http://localhost:5000/chats/${selectedUser.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          sender: 'admin',
        }),
      });

      if (response.ok) {
        setNewMessage('');
        // Fetch updated messages after sending
        fetchUserMessages(selectedUser.id);
        // Fetch updated chat list
        fetchChats();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name && searchTerm 
      ? user.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - User List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="ค้นหาการสนทนา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <h3 className="px-4 py-2 text-sm font-semibold text-gray-500">การสนทนาทั้งหมด</h3>
          {loading ? (
            <div className="flex items-center justify-center h-20">
              <span className="text-gray-500">กำลังโหลด...</span>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                    selectedUser?.id === user.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.lastMessageTime}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                      {user.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-500 rounded-full">
                          {user.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Content - Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">
                    {selectedUser.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{selectedUser.name}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex mb-4 ${
                    message.sender === 'admin' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === 'admin'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="พิมพ์ข้อความ..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  disabled={!newMessage.trim()}
                >
                  ส่ง
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">เลือกการสนทนาเพื่อดูข้อความ</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatPage;