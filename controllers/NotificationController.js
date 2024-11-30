// controllers/Notification.js
const axios = require('axios');
require('dotenv').config();  // โหลดค่าจากไฟล์ .env

// ฟังก์ชันส่งข้อความไปยัง Group ID
const sendMessageToGroup = async (groupId, message) => {
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;  // ใช้ Token ของคุณ

  const url = 'https://api.line.me/v2/bot/message/push';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };

  const body = {
    to: groupId,  // ใช้ Group ID ที่ได้รับจาก webhook
    messages: [
      {
        type: 'text',
        text: message
      }
    ]
  };

  try {
    const response = await axios.post(url, body, { headers });
    console.log('Message sent:', response.data);
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
  }
};

// ฟังก์ชันสำหรับการส่งการแจ้งเตือนการชำระเงิน
const sendPaymentCompletedNotification = async (userId) => {
  const message = "การชำระเงินของคุณสำเร็จแล้ว ขอบคุณที่เลือกใช้บริการ!";
  return await sendMessageToLineUser(userId, message);
};

// ฟังก์ชันส่งข้อความไปยัง Line User ID
const sendMessageToLineUser = async (userId, message) => {
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  const url = 'https://api.line.me/v2/bot/message/push';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };

  const body = {
    to: userId,
    messages: [
      {
        type: 'text',
        text: message
      }
    ]
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// ส่งออกฟังก์ชันทั้งหมด
module.exports = {
  sendPaymentCompletedNotification,
  sendMessageToLineUser,
  sendMessageToGroup
};
