"use client";
import React, { useState, useEffect } from 'react';
import { Search, MessageSquare } from 'lucide-react';
import { socketService } from '../../services/socketService';

interface ChatMessage {
  message_id: string; // Changed from id to match backend
  content: string;
  sender_type: 'user' | 'admin'; // Changed from sender to match backend
  created_at: string; // Changed from timestamp to match backend
  chat_id: string;
  read: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
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

  useEffect(() => {
    socketService.connect();
    socketService.joinAdminRoom();

    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/chat', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        // ... rest of your code
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();

    return () => {
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      socketService.joinChat(selectedUser.id);
      
      const fetchMessages = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/chat/${selectedUser.id}/messages`);
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
      
      fetch(`http://localhost:5000/api/chat/${selectedUser.id}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reader_type: 'admin' }),
      });

      return () => {
        socketService.leaveChat(selectedUser.id);
      };
    }
  }, [selectedUser]);

  useEffect(() => {
    socketService.onNewMessage((newMessage) => {
      if (selectedUser?.id === newMessage.chat_id) {
        setMessages(prev => [...prev, newMessage]);
      }
      
      setUsers(prev => prev.map(user => {
        if (user.id === newMessage.chat_id) {
          return {
            ...user,
            lastMessage: newMessage.content,
            lastMessageTime: new Date(newMessage.created_at).toLocaleString(),
            unreadCount: user.unreadCount + (newMessage.sender_type === 'user' ? 1 : 0)
          };
        }
        return user;
      }));
    });

    return () => {
      socketService.offNewMessage();
    };
  }, [selectedUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await fetch('http://localhost:5000/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: selectedUser.id,
          sender_id: 'ADMIN_001',
          sender_type: 'admin',
          content: newMessage,
        }),
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    socketService.onConnect(() => {
      console.log('Connected to socket server');
    });
  
    socketService.onDisconnect(() => {
      console.log('Disconnected from socket server');
    });
  
    socketService.onError((error) => {
      console.error('Socket connection error:', error);
    });
  
    return () => {
      socketService.disconnect();
    };
  }, []);

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
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                    selectedUser?.id === user.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-lg">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                    )}
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
  {messages.map((message) => (
    <div
      key={message.message_id}
      className={`flex mb-4 ${
        message.sender_type === 'admin' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          message.sender_type === 'admin'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p className="text-xs mt-1 opacity-75">
          {new Date(message.created_at).toLocaleTimeString()}
        </p>
      </div>
    </div>
  ))}
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