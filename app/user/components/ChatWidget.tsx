// components/ChatWidget.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { io } from 'socket.io-client';
import { getSession } from "next-auth/react"; // Import getSession
import Image from 'next/image'; // Add this import

const socket = io('http://localhost:5000');

interface ChatWidgetProps {
  initialUserName?: string;
}

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
  unreadCount: number;
  avatar?: string;
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

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const sessionUserId = (session.user as { user_id?: string }).user_id;
        if (sessionUserId) {
          setUserId(sessionUserId);
          setUserName(sessionUserId); // Or use a different name field from session if available
        }
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    // Initialize chat when widget opens and we have userId
    if (isOpen && !chatId && userId) {
      initializeChat();
    }
  
    // Listen for new messages
    socket.on('newMessage', (data) => {
      if (data.chatId === chatId) {
        setMessages(prev => [...prev, data.message]);
        // Increment unread count if chat is closed
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
      // Use the authenticated userId instead of 'guest'
      const response = await fetch('http://localhost:5000/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId, // Use authenticated userId
          user_name: userName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatId(data.chat_id);
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !chatId) return;

    try {
      const response = await fetch(`http://localhost:5000/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
          sender: 'user',
        }),
      });

      if (response.ok) {
        setMessage('');
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
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {msg.content}
                  <div className="text-xs mt-1 opacity-75">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="กรอกข้อความ"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                ส่ง
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="relative inline-block">
        <button
          onClick={() => setIsOpen(true)}
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