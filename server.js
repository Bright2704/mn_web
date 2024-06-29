const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');  // Add this line

const app = express();

// Use CORS middleware
app.use(cors());  // Add this line

// Mongo URI
const mongoURI = 'mongodb://127.0.0.1:27017/MN_TEST';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const conn = mongoose.connection;

// Init gfs
let gfs;
conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// @route POST /upload
// @desc  Uploads file to DB
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

// @route GET /files/:id
// @desc  Display file by ObjectId
app.get('/files/:id', (req, res) => {
  const fileId = mongoose.Types.ObjectId(req.params.id);
  gfs.files.findOne({ _id: fileId }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file._id);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

// Define the Product schema and model
const ProductSchema = new mongoose.Schema({
  order_id: String,
  cus_id: String,
  product: mongoose.Schema.Types.ObjectId,
  note: String,
  trans_type: String,
  status: String
});
const Product = mongoose.model('Product', ProductSchema, 'product');  // Specify collection name

// @route GET /products/pending
// @desc  Get all products with status "รอตรวจสอบ"
app.get('/products/pending', async (req, res) => {
  try {
    const products = await Product.find({ status: 'รอตรวจสอบ' });
    console.log('Fetched products:', products); // Add this line for debugging
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: err.message });
  }
});

const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
