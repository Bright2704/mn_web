const mongoose = require('mongoose');

// Mongo URI
const mongoURI = 'mongodb://127.0.0.1:27017/MN_TEST';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connection successful');
    mongoose.connection.close(); // Close the connection after successful test
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
