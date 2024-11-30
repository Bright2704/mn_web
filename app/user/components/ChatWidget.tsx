// components/ChatWidget.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Paperclip, Image as ImageIcon } from 'lucide-react';
import { io } from 'socket.io-client';
import { getSession } from "next-auth/react";
import Image from 'next/image';

const socket = io('http://localhost:5000');

interface ChatWidgetProps {
  initialUserName?: string;
}

interface ChatMessage {
  id: string;
  content: string | FileContent;
  messageType: 'text' | 'image' | 'file';
  sender: 'user' | 'admin';
  timestamp: string;
  read: boolean;
}

interface FileContent {
  fileName: string;
  filePath: string;
  fileType: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ initialUserName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string>('guest');
  const [userName, setUserName] = useState<string>(initialUserName || 'Guest User');
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const storedUnreadCount = localStorage.getItem(`chat_unread_${userId}`);
    if (storedUnreadCount) {
      setUnreadCount(parseInt(storedUnreadCount));
    }
  }, [userId]);

  // Save unread count to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialMount.current) {
      localStorage.setItem(`chat_unread_${userId}`, unreadCount.toString());
    } else {
      isInitialMount.current = false;
    }
  }, [unreadCount, userId]);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const sessionUserId = (session.user as { user_id?: string }).user_id;
        if (sessionUserId) {
          setUserId(sessionUserId);
          setUserName(sessionUserId);
        }
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    if (isOpen && !chatId && userId) {
      initializeChat();
    }

    socket.on('newMessage', (data) => {
      if (data.chatId === chatId) {
        setMessages(prev => {
          const messageExists = prev.some(msg => 
            msg.timestamp === data.message.timestamp && 
            msg.content === data.message.content
          );
          if (messageExists) return prev;
          return [...prev, data.message];
        });
        
        if (!isOpen && data.message.sender === 'admin') {
          setUnreadCount(prev => prev + 1);
        }
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [isOpen, chatId, userId]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    try {
      const response = await fetch('http://localhost:5000/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          user_name: userName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatId(data.chat_id);
        setMessages(data.messages || []);
        
        // Calculate initial unread count from fetched messages
        const unreadMessages = data.messages?.filter(
          (msg: ChatMessage) => msg.sender === 'admin' && !msg.read
        ).length || 0;
        setUnreadCount(unreadMessages);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && !selectedFile) || !chatId) return;
  
    try {
      const formData = new FormData();
      formData.append('sender', 'user');
  
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        formData.append('content', message);
      }
  
      const response = await fetch(`http://localhost:5000/chats/${chatId}/messages`, {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        // Don't update messages here, let socket handle it
        setMessage('');
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const error = await response.json();
        console.error('Error sending message:', error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToLatest = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // Small delay to ensure content is rendered
  };

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      scrollToLatest();
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToLatest();
    }
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const renderMessage = (msg: ChatMessage) => {
    if (msg.messageType === 'text') {
      return <span>{msg.content as string}</span>;
    } else if (msg.messageType === 'image') {
      const content = msg.content as FileContent;
      return (
        <Image 
          src={content.filePath}
          alt={content.fileName}
          width={200}
          height={200}
          className="rounded-lg cursor-pointer"
          onClick={() => window.open(content.filePath, '_blank')}
        />
      );
    } else {
      const content = msg.content as FileContent;
      return (
        <a 
          href={content.filePath}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-600"
        >
          <Paperclip size={16} />
          <span>{content.fileName}</span>
        </a>
      );
    }
  };

  const handleChatOpen = async () => {
    setIsOpen(true);
    setUnreadCount(0);
    
    // Update read status on server
    if (chatId) {
      try {
        await fetch(`http://localhost:5000/chats/${chatId}/mark-read`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };


  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-80">
          <div className="p-4 bg-pink-500 text-white rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                <Image 
                  src="/MN_small_logo.jpg" 
                  alt="MN Logo" 
                  width={40} 
                  height={40}
                  className="w-full h-full object-cover"
                  priority // Add this to prioritize loading
                />
              </div>
              <h5 className="font-medium">MN 1688 Express</h5>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-96 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-pink-200 text-black'
                      : 'bg-gray-100'
                  }`}
                >
                  {renderMessage(msg)}
                  <div className="text-xs mt-1 opacity-75">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex flex-col gap-2">
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Paperclip size={16} />
                  <span>{selectedFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="กรอกข้อความ"
                  disabled={!!selectedFile}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-600"
                >
                  <Paperclip size={20} />
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                  disabled={!message.trim() && !selectedFile}
                >
                  ส่ง
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="relative inline-block">
          <button
            onClick={handleChatOpen}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            <MessageSquare className="w-5 h-5" />
            <span>MN 1688 Express</span>
          </button>
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {unreadCount}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;