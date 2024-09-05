const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
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
  note: String
});
const DepositNew = mongoose.model('DepositNew', DepositNewSchema, 'deposit_new');

const LotSchema = new mongoose.Schema({
  lot_id: String,
  lot_type: String,
  in_cn: String,
  out_cn: String,
  in_th: String,
  num_item: String,
  note: String,
  file_path: String,
  image_path: String
});
const Lot = mongoose.model('Lot', LotSchema, 'lot');

const TrackingSchema = new mongoose.Schema({
  user_id: String,
  not_owner: Boolean,
  tracking_id: String,
  buylist_id: String,
  mnemonics: String,
  lot_type: String,
  type_item: String,
  crate: String,
  check_product: String,
  weight: Number,
  wide: Number,
  high: Number,
  long: Number,
  number: Number,
  pricing: String,
  user_rate: String,
  in_cn: String,
  out_cn: String,
  in_th: String,
  check_product_price: Number,
  new_wrap: Number,
  transport: Number,
  price_crate: Number,
  other: Number,
  status: String
});

const Tracking = mongoose.model('Tracking', TrackingSchema, 'tracking');

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (file.fieldname === 'slip') {
      cb(null, './public/storage/wait/slips/');
    } else if (file.fieldname === 'lotFile') {
      cb(null, './public/storage/lot/lot_file/');
    } else if (file.fieldname === 'lotImage') {
      cb(null, './public/storage/lot/lot_image/');
    }
  },
  filename: function(req, file, cb) {
    if (file.fieldname === 'slip') {
      const deposit_id = req.body.deposit_id || 'default';
      cb(null, `${deposit_id}${path.extname(file.originalname)}`);
    } else {
      const lotId = req.params.lotId || 'default';
      cb(null, `${lotId}${path.extname(file.originalname)}`);
    }
  }
});

// Check file type for allowed extensions
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Invalid file type!');
  }
}

// Define the upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // Increased limit to 5MB
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

// Use these upload middleware for different routes
const uploadSlip = upload.single('slip');
const uploadLotFiles = upload.fields([
  { name: 'lotFile', maxCount: 1 },
  { name: 'lotImage', maxCount: 1 }
]);

// New endpoint to copy and rename slip
app.post('/copy-slip', (req, res) => {
  let { originalPath, newFilename } = req.body;
  const baseDir = path.join(__dirname, 'public', 'storage', 'slips', 'wait');
  originalPath = path.join(baseDir, path.basename(originalPath));
  const destinationPath = path.join(__dirname, 'public/storage/slips/approve', newFilename);

  fs.copyFile(originalPath, destinationPath, (err) => {
    if (err) {
      console.error('Error copying file:', err);
      return res.status(500).json({ error: 'Error copying file' });
    }
    res.status(200).json({ message: 'File copied and renamed successfully' });
  });
});

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
  try {
    const lastDeposit = await DepositNew.findOne().sort({ deposit_id: -1 });
    if (!lastDeposit || !lastDeposit.deposit_id) {
      return 'DEP_0001';
    }
    const match = lastDeposit.deposit_id.match(/DEP_(\d+)/);
    if (!match) {
      console.error('Unexpected deposit_id format:', lastDeposit.deposit_id);
      return 'DEP_0001';
    }
    const lastId = parseInt(match[1], 10);
    if (isNaN(lastId)) {
      console.error('Failed to parse last deposit_id:', lastDeposit.deposit_id);
      return 'DEP_0001';
    }
    const nextId = lastId + 1;
    return `DEP_${nextId.toString().padStart(4, '0')}`;
  } catch (err) {
    console.error('Error generating next deposit_id:', err);
    return 'DEP_0001';
  }
}
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

// Endpoint for creating new deposits with file upload
app.post('/deposits_new', (req, res) => {
  uploadSlip(req, res, async (err) => {
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
        slip: `/storage/wait/slips/${req.file.filename}`
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
    const { status, note, date_success } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updatedDeposit = await DepositNew.findOneAndUpdate(
      { deposit_id: depositId },
      { status, note, date_success },
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

// Fetch deposits based on status
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

// Endpoint to generate the next deposit_id
app.get('/deposits_new/next-id', async (req, res) => {
  try {
    const nextDepositId = await generateNextDepositId();
    res.json({ next_deposit_id: nextDepositId });
  } catch (err) {
    console.error('Error in /deposits_new/next-id:', err);
    res.status(500).json({ error: 'Internal server error' });
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

// Fetch all lots from MongoDB
app.get('/lots', async (req, res) => {
  try {
    const lots = await Lot.find();
    res.status(200).json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get the latest lot_id
app.get('/lots/latest', async (req, res) => {
  try {
    const latestLot = await Lot.findOne().sort({ lot_id: -1 });
    res.json(latestLot || { lot_id: 'LOT-00000' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to add a new lot
app.post('/lots', async (req, res) => {
  const { lot_id, lot_type } = req.body;
  const newLot = new Lot({
    lot_id,
    lot_type,
    in_cn: '',
    out_cn: '',
    in_th: '',
    num_item: '',
    note: ''
  });

  try {
    const savedLot = await newLot.save();
    res.status(201).json(savedLot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch a lot by lot_id
app.get('/lots/:lotId', async (req, res) => {
  try {
    const lot = await Lot.findOne({ lot_id: req.params.lotId });
    if (!lot) {
      return res.status(404).json({ error: 'Lot not found' });
    }
    res.json(lot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a lot by lot_id
app.put('/lots/:lotId', (req, res) => {
  uploadLotFiles(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({ error: 'File upload failed: ' + err.message });
    }

    const { lotId } = req.params;
    const { lot_id, lot_type, note, num_item } = req.body;

    if (!lot_id || !lot_type) {
      return res.status(400).json({ error: 'lot_id and lot_type are required' });
    }

    try {
      let updateData = { lot_id, lot_type, note, num_item };

      if (req.files) {
        if (req.files['lotFile'] && req.files['lotFile'][0]) {
          updateData.file_path = `/storage/lot/lot_file/${req.files['lotFile'][0].filename}`;
        }
        if (req.files['lotImage'] && req.files['lotImage'][0]) {
          updateData.image_path = `/storage/lot/lot_image/${req.files['lotImage'][0].filename}`;
        }
      }

      const updatedLot = await Lot.findOneAndUpdate(
        { lot_id: lotId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedLot) {
        return res.status(404).json({ error: 'Lot not found' });
      }
      res.json(updatedLot);
    } catch (err) {
      console.error('Lot update error:', err);
      res.status(500).json({ error: 'Failed to update lot: ' + err.message });
    }
  });
});

// Get file and image paths for a lot
app.get('/lots/:lotId/attachments', async (req, res) => {
  try {
    const lot = await Lot.findOne({ lot_id: req.params.lotId });
    if (!lot) {
      return res.status(404).json({ error: 'Lot not found' });
    }
    res.json({
      file_path: lot.file_path || null,
      image_path: lot.image_path || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/tracking', async (req, res) => {
  try {
    const trackingData = await Tracking.find();
    res.json(trackingData);
  } catch (err) {
    console.error('Error fetching tracking data:', err);
    res.status(500).json({ error: 'Failed to fetch tracking data' });
  }
});

app.post('/tracking', async (req, res) => {
  try {
    const {
      user_id,
      not_owner,
      tracking_id,
      buylist_id,
      mnemonics,
      lot_type,
      type_item,
      crate,
      check_product,
      weight,
      wide,
      high,
      long,
      number,
      pricing,
      user_rate,
      in_cn,
      out_cn,
      in_th,
      check_product_price,
      new_wrap,
      transport,
      price_crate,
      other
    } = req.body;

    // Create a new tracking object
    const newTracking = new Tracking({
      user_id,
      not_owner: not_owner === 'ใช่',
      tracking_id,
      buylist_id,
      mnemonics,
      lot_type,
      type_item,
      crate: crate ? 'ตี' : 'ไม่ตี',
      check_product: check_product ? 'เช็ค' : 'ไม่เช็ค',
      weight: parseFloat(weight) || 0,
      wide: parseFloat(wide) || 0,
      high: parseFloat(high) || 0,
      long: parseFloat(long) || 0,
      number: parseInt(number) || 0,
      pricing,
      user_rate,
      in_cn,
      out_cn,
      in_th,
      check_product_price: parseFloat(check_product_price) || 0,
      new_wrap: parseFloat(new_wrap) || 0,
      transport: parseFloat(transport) || 0,
      price_crate: parseFloat(price_crate) || 0,
      other: parseFloat(other) || 0,
      status: 'เข้าโกดังจีน' // Setting a default status
    });

    const savedTracking = await newTracking.save();
    res.status(201).json(savedTracking);
  } catch (err) {
    console.error('Error creating new tracking:', err);
    res.status(500).json({ error: err.message });
  }
})

// Serve static files from the public directory
app.use('/storage', express.static(path.join(__dirname, 'public/storage')));

// Catch-all route for unhandled requests
app.use((req, res) => {
  res.status(404).send('Not Found');
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});