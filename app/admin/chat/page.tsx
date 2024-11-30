"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, MessageSquare, Paperclip, X } from "lucide-react";
import Image from "next/image";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

interface ChatMessage {
  id: string;
  content: string | FileContent;
  messageType: "text" | "image" | "file";
  sender: "user" | "admin";
  timestamp: string;
  read: boolean;
}

interface FileContent {
  fileName: string;
  filePath: string;
  fileType: string;
}

interface ChatUser {
  id: string;
  name: string;
  lastMessage: {
    text: string;
    type: "text" | "image" | "file";
  };
  lastMessageTime: string;
  timestamp: Date;
  unreadCount: number;
  avatar?: string;
}

const AdminChatPage = () => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalUnread, setTotalUnread] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateTotalUnread = (userList: ChatUser[]) => {
    return userList.reduce((total, user) => total + user.unreadCount, 0);
  };

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/chats");
      const data = await response.json();

      const formattedUsers: ChatUser[] = data.map((chat: any) => ({
        id: chat.chat_id || "",
        name: chat.user_name || "Unknown User",
        lastMessage: formatLastMessage(chat.lastMessage),
        lastMessageTime: chat.lastMessageTime
          ? new Date(chat.lastMessageTime).toLocaleString()
          : "",
        timestamp: chat.lastMessageTime
          ? new Date(chat.lastMessageTime)
          : new Date(0),
        unreadCount: chat.unreadCount || 0,
      }));

      const sortedUsers = formattedUsers.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );

      setUsers(sortedUsers);
      setTotalUnread(calculateTotalUnread(sortedUsers));
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatLastMessage = (message: any): { text: string; type: "text" | "image" | "file" } => {
    if (!message) {
      return {
        text: "",
        type: "text"
      };
    }

    if (typeof message === 'string') {
      return {
        text: message,
        type: "text"
      };
    }

    if (message.messageType === "text") {
      return {
        text: message.content as string,
        type: "text"
      };
    } else if (message.messageType === "image") {
      return {
        text: "🖼️ Sent an image",
        type: "image"
      };
    } else if (message.messageType === "file") {
      const content = message.content as FileContent;
      return {
        text: `📎 ${content.fileName || 'File'}`,
        type: "file"
      };
    }

    return {
      text: "Unknown message type",
      type: "text"
    };
  };

  useEffect(() => {
    fetchChats();
    
    const handleNewMessage = (data: { chatId: string; message: ChatMessage }) => {
      if (selectedUser?.id === data.chatId) {
        setMessages(prev => {
          const messageExists = prev.some(msg => {
            if (msg.messageType !== data.message.messageType) return false;
            
            if (msg.messageType === 'text') {
              return msg.content === data.message.content;
            }
            
            const existingContent = msg.content as FileContent;
            const newContent = data.message.content as FileContent;
            return existingContent.filePath === newContent.filePath;
          });

          if (messageExists) return prev;
          return [...prev, data.message];
        });
        markMessagesAsRead(data.chatId);
      } else {
        setUsers(prevUsers => {
          const updatedUsers = prevUsers.map(user =>
            user.id === data.chatId
              ? {
                  ...user,
                  lastMessage: formatLastMessage(data.message),
                  lastMessageTime: new Date(data.message.timestamp).toLocaleString(),
                  timestamp: new Date(data.message.timestamp),
                  unreadCount: user.unreadCount + 1,
                }
              : user
          );
          const sortedUsers = updatedUsers.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          setTotalUnread(calculateTotalUnread(sortedUsers));
          return sortedUsers;
        });
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("chatUpdate", fetchChats);

    return () => {
      socket.off("newMessage");
      socket.off("chatUpdate");
    };
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedUser) {
      fetchUserMessages(selectedUser.id);
    }
  }, [selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUserMessages = async (chatId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/chats/${chatId}`);
      const data = await response.json();
      setMessages(data.messages);
      markMessagesAsRead(chatId);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const markMessagesAsRead = async (chatId: string) => {
    try {
      await fetch(`http://localhost:5000/chats/${chatId}/read`, {
        method: "PUT",
      });

      setUsers(prevUsers => {
        const updatedUsers = prevUsers.map(user =>
          user.id === chatId ? { ...user, unreadCount: 0 } : user
        );
        setTotalUnread(calculateTotalUnread(updatedUsers));
        return updatedUsers;
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleUserSelect = (user: ChatUser) => {
    setSelectedUser(user);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !selectedUser) return;

    try {
      const formData = new FormData();
      formData.append("sender", "admin");

      if (selectedFile) {
        formData.append("file", selectedFile);
      } else {
        formData.append("content", newMessage);
      }

      const response = await fetch(
        `http://localhost:5000/chats/${selectedUser.id}/messages`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setNewMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const renderMessage = (msg: ChatMessage) => {
    if (msg.messageType === "text") {
      return <span>{msg.content as string}</span>;
    } else if (msg.messageType === "image") {
      const content = msg.content as FileContent;
      return (
        <div className="relative w-[200px] h-[200px]">
          <Image 
            src={content.filePath}
            alt={content.fileName}
            fill
            sizes="200px"
            className="rounded-lg cursor-pointer object-cover"
            onClick={() => window.open(content.filePath, "_blank")}
          />
        </div>
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

  const filteredUsers = users.filter((user) =>
    user.name && searchTerm
      ? user.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - User List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">การสนทนา</h2>
            {totalUnread > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-red-500 rounded-full">
                {totalUnread}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="ค้นหาการสนทนา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <h3 className="px-4 py-2 text-sm font-semibold text-gray-500">
            การสนทนาทั้งหมด
          </h3>
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
                    selectedUser?.id === user.id ? "bg-pink-50" : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.lastMessageTime}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate">
                        {user.lastMessage.text}
                      </p>
                      {user.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-gray-500 rounded-full">
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
                <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">
                    {selectedUser.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedUser.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex mb-4 ${
                    message.sender === "admin" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === "admin"
                        ? "bg-pink-300 text-black"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {renderMessage(message)}
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
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
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="พิมพ์ข้อความ..."
                    disabled={!!selectedFile}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                    className="p-2 text-pink-500 hover:text-pink-600"
                  >
                    <Paperclip size={20} />
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                    disabled={!newMessage.trim() && !selectedFile}
                  >
                    ส่ง
                  </button>
                </div>
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

