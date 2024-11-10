// server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const morgan = require('morgan');

const {readdirSync} = require('fs');
const app = express();

app.use(morgan('dev'));
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

// Define schema and models
const TrackingSchema = new mongoose.Schema({
  user_id: String,
  lot_id: String,
  lot_order: String,
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
  status: String,
  bill_id: String,
  cal_price: Number,
  transport_file_path: String,
  image_item_paths: [String] // Array to store multiple image paths
});

const Tracking = mongoose.model('Tracking', TrackingSchema, 'tracking');

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { tracking_id } = req.body;

    if (file.fieldname === 'slip') {
      cb(null, './public/storage/slips/wait');
    } else if (file.fieldname === 'lotFile') {
      cb(null, './public/storage/lot/lot_file/');
    } else if (file.fieldname === 'lotImage') {
      cb(null, './public/storage/lot/lot_image/');
    } else if (file.fieldname === 'trackingFile') {
      cb(null, './public/storage/tracking/tracking_file/'); // Path for the tracking file
    } else if (file.fieldname === 'trackingImages') {
      cb(null, './public/storage/tracking/tracking_image/'); // Path for the tracking images
    } else {
      cb(new Error('Invalid file fieldname!'));
    }
  },
  filename: function (req, file, cb) {
    const { tracking_id } = req.body;
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    // cb(null, uniqueSuffix + path.extname(file.originalname));

    if (file.fieldname === 'slip') {
      const deposit_id = req.body.deposit_id || 'default';
      cb(null, `${deposit_id}${path.extname(file.originalname)}`);
    } else {
      const lotId = req.params.lotId || 'default';
      cb(null, `${lotId}${path.extname(file.originalname)}`);
    }


    if (file.fieldname === 'trackingFile') {
      // Rename the tracking file to tracking_id.pdf or tracking_id.extension
      cb(null, `${tracking_id}${path.extname(file.originalname)}`);
    } 
    // For tracking images
    else if (file.fieldname === 'trackingImages') {
      const imageIndex = req.imageIndex || 1; // Initialize index for images
      cb(null, `${tracking_id}_${String(imageIndex).padStart(2, '0')}${path.extname(file.originalname)}`);
      req.imageIndex = (req.imageIndex || 1) + 1; // Increment image index
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
    cb(new Error('Error: Invalid file type!'));
  }
}

// Define the upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // Increased limit to 5MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// Use these upload middleware for different routes
const uploadSlip = upload.single('slip');
const uploadLotFiles = upload.fields([
  { name: 'lotFile', maxCount: 1 },
  { name: 'lotImage', maxCount: 1 }
]);


const uploadTrackingFiles = upload.fields([
  { name: 'trackingFile', maxCount: 1 },
  { name: 'trackingImages', maxCount: 10 }
]);

readdirSync('./routes')
.map((c)=> app.use('/api', require('./routes/' + c)));

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
        slip: `/storage/slips/wait/${req.file.filename}`
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

// Fetch deposits from deposit_new collection based on user_id and status
app.get('/deposits_new/user_id/:user_id/status/:status', async (req, res) => {
  try {
    const { user_id, status } = req.params;

    // If status is 'all', fetch all deposits for the user
    let deposits;
    if (status === 'all') {
      deposits = await DepositNew.find({ user_id });
    } else {
      deposits = await DepositNew.find({ user_id, status });
    }

    if (deposits.length === 0) {
      return res.status(404).json({ message: 'No deposits found for this user.' });
    }

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
    num_item: 0,
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

app.get('/tracking/search', async (req, res) => {
  const searchQuery = req.query.q;
  const currentLotId = req.query.lotId;
  
  if (!searchQuery) {
    return res.status(400).json({ message: 'Query is required' });
  }

  try {
    const results = await Tracking.find({
      tracking_id: { $regex: searchQuery, $options: 'i' },
      $or: [
        { lot_id: currentLotId },
        { lot_id: { $in: [null, ''] } }
      ]
    });

    return res.json(results.map(result => result.tracking_id));
  } catch (error) {
    console.error('Error fetching tracking IDs:', error);
    return res.status(500).json({ message: 'Internal server error' });
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

// POST tracking data
app.post('/tracking', (req, res) => {
  uploadTrackingFiles(req, res, async function (err) {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ error: 'Error uploading files' });
    }

    // Extract relevant fields from the request body
    const {
      user_id,
      not_owner,
      tracking_id,
      buylist_id,
      mnemonics,
      lot_type,
      crate,
      check_product,
      number,
    } = req.body;

    // Fields to set to empty or default values if not provided
    const type_item = req.body.type_item || '';
    const weight = parseFloat(req.body.weight) || 0;
    const wide = parseFloat(req.body.wide) || 0;
    const high = parseFloat(req.body.high) || 0;
    const long = parseFloat(req.body.long) || 0;
    const pricing = req.body.pricing || '';
    const cal_price = parseFloat(req.body.cal_price) || 0;
    const user_rate = req.body.user_rate || 'A';
    const in_cn = req.body.in_cn || '';
    const out_cn = req.body.out_cn || '';
    const in_th = req.body.in_th || '';
    const check_product_price = parseFloat(req.body.check_product_price) || 0;
    const new_wrap = parseFloat(req.body.new_wrap) || 0;
    const transport = parseFloat(req.body.transport) || 0;
    const price_crate = parseFloat(req.body.price_crate) || 0;
    const other = req.body.other || '';
    const status = req.body.status || 'รอเข้าโกดังจีน';
    const lot_id = req.body.lot_id || '';
    const lot_order = req.body.lot_order || '';

    // Prepare file paths for any uploaded files
    let transport_file_path = '';
    let image_item_paths = [];

    if (req.files['trackingFile'] && req.files['trackingFile'][0]) {
      transport_file_path = `/storage/tracking/tracking_file/${req.files['trackingFile'][0].filename}`;
    }

    if (req.files['trackingImages']) {
      image_item_paths = req.files['trackingImages'].map(file => `/storage/tracking/tracking_image/${file.filename}`);
    }

    try {
      // Create a new tracking entry in the database
      const newTracking = new Tracking({
        user_id,
        not_owner: not_owner === 'true',
        tracking_id,
        buylist_id,
        mnemonics,
        lot_type,
        type_item,
        crate: crate === 'true' ? 'ตี' : 'ไม่ตี',
        check_product: check_product === 'true' ? 'เช็ค' : 'ไม่เช็ค',
        weight,
        wide,
        high,
        long,
        number: parseInt(number, 10) || 0,
        pricing,
        cal_price,
        user_rate,
        in_cn,
        out_cn,
        in_th,
        check_product_price,
        new_wrap,
        transport,
        price_crate,
        other,
        status,
        lot_id,
        lot_order,
        transport_file_path, // Path of the uploaded and renamed tracking file
        image_item_paths // Paths of the uploaded and renamed images
      });

      // Save the tracking entry to the database
      const savedTracking = await newTracking.save();
      res.status(201).json(savedTracking);
    } catch (err) {
      console.error('Error creating tracking:', err);
      res.status(500).json({ error: 'Failed to create tracking' });
    }
  });
});

// Endpoint to update a tracking entry by tracking_id
app.put('/tracking/:trackingId', (req, res) => {
  uploadTrackingFiles(req, res, async function (err) {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ error: 'Error uploading files' });
    }

    const { trackingId } = req.params;
    const {
      user_id,
      not_owner,
      buylist_id,
      mnemonics,
      lot_type,
      lot_id,
      lot_order,
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
      other,
      cal_price,
      bill_id
    } = req.body;

    // Fetch existing tracking data
    let existingTracking = await Tracking.findOne({ tracking_id: trackingId });

    if (!existingTracking) {
      return res.status(404).json({ error: 'Tracking not found' });
    }

    // Use existing paths if no new file or image is uploaded
    let transport_file_path = existingTracking.transport_file_path;
    let image_item_paths = existingTracking.image_item_paths;

    // If tracking file is uploaded, replace the existing path
    if (req.files['trackingFile'] && req.files['trackingFile'][0]) {
      transport_file_path = `/storage/tracking/tracking_file/${req.files['trackingFile'][0].filename}`;
    }

    // If tracking images are uploaded, replace the existing paths
    if (req.files['trackingImages']) {
      image_item_paths = req.files['trackingImages'].map(file => `/storage/tracking/tracking_image/${file.filename}`);
    }

    try {
      // Update the tracking entry in the database
      const updatedTracking = await Tracking.findOneAndUpdate(
        { tracking_id: trackingId },
        {
          user_id,
          not_owner: not_owner === 'true',
          buylist_id,
          mnemonics,
          lot_type,
          lot_id,
          lot_order,
          type_item,
          crate: crate === 'true' ? 'ตี' : 'ไม่ตี',
          check_product: check_product === 'true' ? 'เช็ค' : 'ไม่เช็ค',
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
          cal_price: parseFloat(cal_price) || 0,
          bill_id,
          transport_file_path, // Retain or update path of the tracking file
          image_item_paths // Retain or update paths of the images
        },
        { new: true } // Return the updated document
      );

      res.json(updatedTracking); // Send back the updated tracking entry
    } catch (err) {
      console.error('Error updating tracking:', err);
      res.status(500).json({ error: 'Failed to update tracking' });
    }
  });
});

// Fetch tracking details by tracking_id
app.get('/tracking/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;
    const tracking = await Tracking.findOne({ tracking_id: trackingId });

    if (!tracking) {
      return res.status(404).json({ error: 'Tracking not found' });
    }

    res.json(tracking);
  } catch (err) {
    console.error('Error fetching tracking details:', err);
    res.status(500).json({ error: 'Failed to fetch tracking details' });
  }
});
app.get('/tracking/lot/:lotId', async (req, res) => {
  try {
    const { lotId } = req.params;
    const trackingData = await Tracking.find({ lot_id: lotId });
    
    if (trackingData.length === 0) {
      return res.status(404).json({ message: 'No tracking data found for this lot_id' });
    }

    res.json(trackingData);
  } catch (err) {
    console.error('Error fetching tracking data:', err);
    res.status(500).json({ error: 'Failed to fetch tracking data' });
  }
});

// New endpoint to update tracking date fields only (no file uploads)
app.put('/tracking/:trackingId/updateFields', async (req, res) => {
  const { trackingId } = req.params;
  const updateFields = req.body;  // Expect dynamic fields from the request body

  try {
    // Update only the fields provided in the request body (in_cn, out_cn, in_th, etc.)
    const updatedTracking = await Tracking.findOneAndUpdate(
      { tracking_id: trackingId },
      { $set: updateFields },
      { new: true }  // Return the updated document
    );

    if (!updatedTracking) {
      return res.status(404).json({ error: 'Tracking not found' });
    }

    res.json(updatedTracking);  // Return the updated document
  } catch (err) {
    console.error('Error updating tracking:', err);
    res.status(500).json({ error: 'Failed to update tracking' });
  }
});

// New route to update only the lot_id of a tracking document
app.put('/tracking/:trackingId/update-lot-id', async (req, res) => {
  const { trackingId } = req.params;
  const { newLotId } = req.body;  // Assuming the new lot_id is passed in the body

  try {
    // Find the tracking document by tracking_id and update the lot_id
    const updatedTracking = await Tracking.findOneAndUpdate(
      { tracking_id: trackingId },  // Find the document by tracking_id
      { $set: { lot_id: newLotId } },  // Update the lot_id field
      { new: true }  // Return the updated document
    );

    if (!updatedTracking) {
      return res.status(404).json({ error: 'Tracking not found' });
    }

    res.json(updatedTracking);  // Return the updated tracking document
  } catch (err) {
    console.error('Error updating lot_id:', err);
    res.status(500).json({ error: 'Failed to update lot_id' });
  }
});


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
