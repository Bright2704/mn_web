// routes/taxInfoRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const TaxInfoController = require('../controllers/TaxInfoController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/storage/tax/tax_file/');
    },
    filename: (req, file, cb) => {
      // For PUT requests, user_id needs to be fetched from the database
      if (req.method === 'PUT') {
        const TaxInfo = require('../models/TaxInfo');
        TaxInfo.findById(req.params.id)
          .then(taxInfo => {
            const userId = taxInfo.user_id;
            const ext = path.extname(file.originalname);
            cb(null, `${userId}_tax_info${ext}`);
          })
          .catch(err => cb(err));
      } else {
        // For POST requests, user_id comes from the request body
        const userId = req.body.user_id;
        const ext = path.extname(file.originalname);
        cb(null, `${userId}_tax_info${ext}`);
      }
    }
  });
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: (req, file, cb) => {
      const filetypes = /pdf|jpg|jpeg|png/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
      if (mimetype && extname) return cb(null, true);
      cb(new Error('Invalid file type! Only PDF and images allowed.'));
    }
  });

router.post('/', upload.single('document'), TaxInfoController.createTaxInfo);
router.get('/', TaxInfoController.getAllTaxInfo);
router.put('/:id', upload.single('document'), TaxInfoController.updateTaxInfo);
router.delete('/:id', TaxInfoController.deleteTaxInfo);
router.get('/user/:userId', TaxInfoController.getTaxInfoByUserId);

module.exports = router;