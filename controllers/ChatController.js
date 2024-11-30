// controllers/ChatController.js
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Get all chats
exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.aggregate([
      {
        $lookup: {
          from: 'messages',
          localField: 'chat_id',
          foreignField: 'chat_id',
          pipeline: [
            { $sort: { created_at: -1 } },
            { $limit: 1 }
          ],
          as: 'lastMessage'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: 'user_id',
          as: 'user'
        }
      },
      {
        $project: {
          chat_id: 1,
          user_id: 1,
          status: 1,
          created_at: 1,
          updated_at: 1,
          lastMessage: { $arrayElemAt: ['$lastMessage', 0] },
          user: { $arrayElemAt: ['$user', 0] },
          unreadCount: {
            $size: {
              $filter: {
                input: '$messages',
                as: 'message',
                cond: { $eq: ['$$message.read', false] }
              }
            }
          }
        }
      }
    ]);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new chat
exports.createChat = async (req, res) => {
  try {
    const lastChat = await Chat.findOne().sort({ chat_id: -1 });
    const nextChatId = lastChat 
      ? `CHAT_${(parseInt(lastChat.chat_id.split('_')[1]) + 1).toString().padStart(4, '0')}`
      : 'CHAT_0001';

    const newChat = new Chat({
      chat_id: nextChatId,
      user_id: req.body.user_id,
      status: 'active'
    });

    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get chat messages
exports.getChatMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat_id: req.params.chatId })
      .sort({ created_at: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const lastMessage = await Message.findOne().sort({ message_id: -1 });
    const nextMessageId = lastMessage 
      ? `MSG_${(parseInt(lastMessage.message_id.split('_')[1]) + 1).toString().padStart(4, '0')}`
      : 'MSG_0001';

    const newMessage = new Message({
      message_id: nextMessageId,
      chat_id: req.body.chat_id,
      sender_id: req.body.sender_id,
      sender_type: req.body.sender_type,
      content: req.body.content
    });

    const savedMessage = await newMessage.save();

    // Update chat's updated_at timestamp
    await Chat.findOneAndUpdate(
      { chat_id: req.body.chat_id },
      { updated_at: Date.now() }
    );

    // Emit message through WebSocket
    req.io.to(`chat:${req.body.chat_id}`).emit('new-message', savedMessage);

    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      { 
        chat_id: req.params.chatId,
        read: false,
        sender_type: { $ne: req.body.reader_type }
      },
      { read: true }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};