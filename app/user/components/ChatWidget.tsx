// First, let's create a separate ChatWidget component (in components/ChatWidget.tsx):
import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { socketService } from '../../services/socketService';

interface ChatMessage {
    content: string;
    sender_id:string;
    sender_type: 'user' | 'admin';
    chat_id: string;
    created_at: string;
  }
  
  const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatId, setChatId] = useState<string | null>(null);
  
    useEffect(() => {
      const initializeChat = async () => {
        try {
          // Create a new chat session
          const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: 'USER_001' // Replace with actual user ID
            }),
          });
          const chat = await response.json();
          setChatId(chat.chat_id);
          
          // Join the chat room
          socketService.connect();
          socketService.joinChat(chat.chat_id);
          
          // Load existing messages
          const messagesResponse = await fetch(`http://localhost:5000/api/chat/${chat.chat_id}/messages`);
          const existingMessages = await messagesResponse.json();
          setMessages(existingMessages);
        } catch (error) {
          console.error('Error initializing chat:', error);
        }
      };
  
      if (isOpen && !chatId) {
        initializeChat();
      }
  
      return () => {
        if (chatId) {
          socketService.leaveChat(chatId);
        }
      };
    }, [isOpen, chatId]);
  
    useEffect(() => {
      socketService.onNewMessage((newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      });
  
      return () => {
        socketService.offNewMessage();
      };
    }, []);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim() || !chatId) return;
  
      try {
        await fetch('http://localhost:5000/api/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            sender_id: 'USER_001', // Replace with actual user ID
            sender_type: 'user',
            content: message,
          }),
        });
        
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };
  
    return (

    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-80">
          <div className="p-4 bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h5 className="font-medium">ติดต่อเรา</h5>
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
                  msg.sender_type === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender_type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="กรอกข้อความ"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                ส่ง
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <MessageSquare className="w-5 h-5" />
            <span>ติดต่อ</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;