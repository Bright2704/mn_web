const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb://127.0.0.1:27017/MN_TEST';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const conn = mongoose.connection;

let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

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

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

app.get('/files/:id', (req, res) => {
  const fileId = mongoose.Types.ObjectId(req.params.id);
  gfs.files.findOne({ _id: fileId }, (err, file) => {
    if (err) {
      return res.status(500).json({ err: 'Error finding file' });
    }
    if (!file || file.length === 0) {
      return res.status(404).json({ err: 'No file exists' });
    }

    const readstream = gfs.createReadStream(file._id);
    readstream.pipe(res);
  });
});

const OrderSchema = new mongoose.Schema({
  order_id: String,
  cus_id: String,
  product: String,
  note: String,
  trans_type: String,
  status: String
});
const Order = mongoose.model('Order', OrderSchema, 'orders');

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

const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
