// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path'); // Add this line

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store io instance in app for use in controllers
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/MN_TEST', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Socket.IO Connection Handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


// Route Imports
const orderRoutes = require('./routes/orderRoutes');
const itemRoutes = require('./routes/itemRoutes');
const depositRoutes = require('./routes/depositRoutes');
const lotRoutes = require('./routes/lotRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const bookBankRoutes = require('./routes/bookBankRoutes'); 
const withdrawRoutes = require('./routes/withdrawRoutes');
const bookAddressRoutes = require('./routes/bookAddressRoutes');
const userRoutes = require('./routes/userRoutes');
const createPaymentRoutes = require('./routes/createPaymentRoutes');
const taxInfoRoutes = require('./routes/taxInfoRoutes');
const announcementRoutes = require('./routes/announcement'); 
// const notificationRoutes = require('./routes/notificationRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/storage', express.static(path.join(__dirname, 'public/storage')));

app.use('/orders', orderRoutes);
app.use('/items', itemRoutes);
app.use('/deposits', depositRoutes);
app.use('/lots', lotRoutes);
app.use('/tracking', trackingRoutes);
app.use('/balances', balanceRoutes);
app.use('/book_bank', bookBankRoutes); 
app.use('/withdraws', withdrawRoutes);
app.use('/book_address', bookAddressRoutes);
app.use('/users', userRoutes);
app.use('/createpayment', createPaymentRoutes);
app.use('/tax_info', taxInfoRoutes);
app.use('/api/announcement', announcementRoutes);
// app.use('/api/notification', notificationRoutes);
app.use('/chats', chatRoutes);

app.use((req, res) => res.status(404).send('Not Found'));

const port = 5000;
server.listen(port, () => console.log(`Server started on http://localhost:${port}`));
