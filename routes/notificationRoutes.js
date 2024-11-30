// routes/notification.js
const express = require('express');
const router = express.Router();
const { sendMessageToGroup } = require('../controllers/NotificationController'); // นำเข้า Controller

// Webhook endpoint ที่ Line API จะส่งข้อมูลมาที่นี่
router.post('/webhook', async (req, res) => {
  const events = req.body.events;
  for (const event of events) {
    if (event.type === 'message') {
      const groupId = event.source.groupId;  // นี่คือ Group ID ที่คุณต้องการ
      const message = event.message.text;
      console.log('Group ID:', groupId);  // แสดง Group ID

      // ส่งข้อความไปยังกลุ่ม
      const replyMessage = `คุณพูดว่า: ${message}`;
      await sendMessageToGroup(groupId, replyMessage);
    }
  }

  // ตอบกลับเพื่อยืนยันว่า webhook ได้รับข้อมูล
  res.status(200).send('OK');
});

app.use(express.json());

const LINE_BOT_API = 'https://api.line.me/v2/bot';
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
};

app.post('/webhook', async (req, res) => {
    const events = req.body.events;

    for (const event of events) {
        if (event.type === 'message' && event.source.groupId) {
            const groupId = event.source.groupId;
            const userMessage = event.message.text;

            console.log(`Received message from group ${groupId}: ${userMessage}`);

            // ส่งข้อความกลับไปที่กลุ่ม
            const replyMessage = `คุณพูดว่า: ${userMessage}`;
            await sendMessageToGroup(groupId, replyMessage);  // ฟังก์ชันที่ส่งข้อความกลับไปยังกลุ่ม
        }
    }

    res.status(200).send('OK');
});


app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});


module.exports = router;
