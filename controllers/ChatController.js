// controllers/ChatController.js
const Chat = require('../models/Chat');

exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({ chat_id: req.params.id });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOrGetChat = async (req, res) => {
  try {
    const { user_id, user_name } = req.body;
    
    // Try to find existing chat for this user
    let chat = await Chat.findOne({ user_id: user_id });
    
    if (chat) {
      // If chat exists, return it
      return res.json(chat);
    }
    
    // If no chat exists, create new one
    const lastChat = await Chat.findOne().sort({ chat_id: -1 });
    const nextChatId = lastChat 
      ? `CHAT_${(parseInt(lastChat.chat_id.split('_')[1]) + 1).toString().padStart(4, '0')}`
      : 'CHAT_0001';

    const newChat = new Chat({
      chat_id: nextChatId,
      user_id: user_id,
      user_name: user_name,
      messages: [],
      lastMessage: '',
      lastMessageTime: new Date(),
      unreadCount: 0
    });

    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const chat = await Chat.findOne({ chat_id: req.params.id });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    const newMessage = {
      content: req.body.content,
      sender: req.body.sender,
      timestamp: new Date(),
      read: req.body.sender === 'admin'
    };

    chat.messages.push(newMessage);
    chat.lastMessage = req.body.content;
    chat.lastMessageTime = new Date();
    if (req.body.sender === 'user') {
      chat.unreadCount += 1;
    }

    const updatedChat = await chat.save();
    
    // Emit socket event for real-time updates
    req.app.get('io').emit('newMessage', {
      chatId: req.params.id,
      message: newMessage
    });

    res.json(updatedChat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markMessagesAsRead = async (req, res) => {
  try {
    const chat = await Chat.findOne({ chat_id: req.params.id });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    chat.messages = chat.messages.map(msg => ({
      ...msg,
      read: true
    }));
    chat.unreadCount = 0;

    const updatedChat = await chat.save();
    res.json(updatedChat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};