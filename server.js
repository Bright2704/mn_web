const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb://127.0.0.1:27017/MN_TEST';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schema and models
const OrderSchema = new mongoose.Schema({
  order_id: String,
  cus_id: String,
  product: String,
  note: String,
  trans_type: String,
  status: String
});
const Order = mongoose.model('Order', OrderSchema, 'orders');

const ItemSchema = new mongoose.Schema({
  user_id: String,
  tracking_number: String,
  lot: String,
  type_transport: String,
  follow_by: String,
  china_shipping_cost: Number,
  china_shipping_cost_baht: Number,
  packaging: String,
  check_product: String,
  warehouse_entry: String,
  departure_from_china: String,
  arrival_in_thailand: String,
  status: String
});
const Item = mongoose.model('Item', ItemSchema, 'items');

const DepositSchema = new mongoose.Schema({
  deposit_id: String,
  date: String,
  user_id: String,
  amount: mongoose.Schema.Types.Mixed,
  status: String
});
const Deposit = mongoose.model('Deposit', DepositSchema, 'deposit');

const DepositNewSchema = new mongoose.Schema({
  deposit_id: String,
  date_deposit: String,
  date_success: String,
  user_id: String,
  amount: mongoose.Schema.Types.Mixed,
  bank: String,
  status: String,
  slip: String,
  note: String // Note field added for rejection reasons
});
const DepositNew = mongoose.model('DepositNew', DepositNewSchema, 'deposit_new');

//#TODO: This will fetch all orders
// app.get('/orders', async (req, res) => {
//   try {
//     const orders = await Order.find({}); // This will fetch all orders
//     console.log('Fetched all orders:', orders);
//     res.json(orders);
//   } catch (err) {
//     console.error('Error fetching orders:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

app.get('/orders/status/:status', async (req, res) => {
  try {
    const status = req.params.status;
    const orders = await Order.find({ status });
    console.log('Fetched orders:', orders);
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    const order = await Order.findOneAndUpdate({ order_id: orderId }, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payment', async (req, res) => {
  console.log("Received orders to save:", req.body);  // Log the received orders
  try {
    const orderData = req.body;
    const order = new Order(orderData);
    const savedOrder = await order.save();  // Save and capture the result
    console.log("Saved order details:", savedOrder);  // Log the saved order details
    res.status(201).send({ message: 'Order saved successfully!', data: savedOrder });
  } catch (error) {
    console.error('Error saving order:', error);  // Log errors
    res.status(500).send({ message: 'Failed to save the order', error: error.message });
  }
});

// Configure storage for multer
const storage = multer.diskStorage({
  destination: './public/storage/wait/slips/',
  filename: function(req, file, cb) {
    const deposit_id = req.body.deposit_id || 'default';
    const filename = `${deposit_id}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

// New endpoint to copy and rename slip
app.post('/copy-slip', (req, res) => {
  let { originalPath, newFilename } = req.body;

  // Construct the absolute path without using `window`
  const baseDir = path.join(__dirname, 'public', 'storage', 'slips', 'wait');
  originalPath = path.join(baseDir, path.basename(originalPath)); // Assuming originalPath is relative from the client

  const destinationPath = path.join(__dirname, 'public/storage/slips/approve', newFilename);

  fs.copyFile(originalPath, destinationPath, (err) => {
    if (err) {
      console.error('Error copying file:', err);
      return res.status(500).json({ error: 'Error copying file' });
    }
    res.status(200).json({ message: 'File copied and renamed successfully' });
  });
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('slip');

// Check file type for allowed extensions
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Updated route to check if the slip exists with either .jpg or .png extension
app.get('/check-slip/:filename', (req, res) => {
    const filename = req.params.filename;
    const jpgPath = path.join(__dirname, 'public/storage/slips/approve', `${filename}.jpg`);
    const pngPath = path.join(__dirname, 'public/storage/slips/approve', `${filename}.png`);

    fs.access(jpgPath, fs.constants.F_OK, (err) => {
        if (!err) {
            return res.status(200).json({ message: 'Slip found', filePath: `/storage/slips/approve/${filename}.jpg` });
        }
        fs.access(pngPath, fs.constants.F_OK, (err) => {
            if (!err) {
                return res.status(200).json({ message: 'Slip found', filePath: `/storage/slips/approve/${filename}.png` });
            }
            return res.status(404).json({ message: 'สลิปนี้ไม่มีในระบบ' });
        });
    });
});

// Generate next deposit ID
async function generateNextDepositId() {
  const lastDeposit = await DepositNew.findOne().sort({ deposit_id: -1 });
  if (!lastDeposit) {
    return 'DEP_0001';
  }
  const lastId = parseInt(lastDeposit.deposit_id.split('_')[1]);
  const nextId = lastId + 1;
  return `DEP_${nextId.toString().padStart(4, '0')}`;
}

// Endpoint for creating new deposits with file upload
app.post('/deposits_new', async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file selected' });
    }

    try {
      const {
        date_deposit,
        date_success,
        user_id,
        amount,
        bank,
        status
      } = req.body;

      if (!date_deposit || !user_id || !amount || !bank || !status) {
        return res.status(400).json({ error: 'Required fields are missing' });
      }

      const deposit_id = await generateNextDepositId();

      const formattedDate = new Date(date_deposit).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(',', '');

      const newDeposit = new DepositNew({
        deposit_id,
        date_deposit: formattedDate,
        date_success,
        user_id,
        amount,
        bank,
        status,
        slip: `/storage/slips/${req.file.filename}`
      });

      const savedDeposit = await newDeposit.save();
      res.status(201).json(savedDeposit);
    } catch (err) {
      console.error('Error creating new deposit:', err);
      res.status(500).json({ error: err.message });
    }
  });
});

// Endpoint to update deposit status and note in deposit_new collection
app.put('/deposits_new/:depositId', async (req, res) => {
  try {
    const { depositId } = req.params;
    const { status, note, date_success } = req.body; // Include date_success in the destructuring

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updatedDeposit = await DepositNew.findOneAndUpdate(
      { deposit_id: depositId },
      { status, note, date_success }, // Update date_success along with status and note
      { new: true, runValidators: true }
    );

    if (!updatedDeposit) {
      return res.status(404).json({ error: 'Deposit not found' });
    }

    res.json(updatedDeposit);
  } catch (err) {
    console.error('Error updating deposit:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Additional routes
app.get('/deposits/status/:status', async (req, res) => {
  try {
    const status = req.params.status;
    let deposits = status === 'all' ? await Deposit.find() : await Deposit.find({ status });
    res.json(deposits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update deposit status in old deposit collection
app.put('/deposits/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const depositId = req.params.id;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const deposit = await Deposit.findOneAndUpdate(
      { deposit_id: depositId },
      { status },
      { new: true, runValidators: true }
    );

    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found' });
    }

    res.json(deposit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch items based on status, search term, and pagination
app.get('/items', async (req, res) => {
  const { status, page = 1, term = '' } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  const query = {
    ...(status && status !== 'all' && { status }),
    ...(term && { $or: [{ user_id: { $regex: term, $options: 'i' } }, { tracking_number: { $regex: term, $options: 'i' } }] })
  };

  try {
    const items = await Item.find(query).skip(skip).limit(limit);
    const totalItems = await Item.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    res.json({ items, totalPages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update item status
app.put('/items/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const itemId = req.params.id;
    const item = await Item.findByIdAndUpdate(itemId, { status }, { new: true });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch deposits from deposit_new collection based on status
app.get('/deposits_new/status/:status', async (req, res) => {
  try {
    const status = req.params.status;
    let deposits = status === 'all' ? await DepositNew.find() : await DepositNew.find({ status });
    res.json(deposits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch a specific deposit based on deposit_id
app.get('/deposits_new/:deposit_id', async (req, res) => {
  try {
    const deposit = await DepositNew.findOne({ deposit_id: req.params.deposit_id });
    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found' });
    }
    res.json(deposit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to generate the next deposit_id
app.get('/deposits_new/next-id', async (req, res) => {
  try {
    const nextDepositId = await generateNextDepositId();
    res.json({ next_deposit_id: nextDepositId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Catch-all route for unhandled requests
app.use((req, res) => {
  res.status(404).send('Not Found');
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
