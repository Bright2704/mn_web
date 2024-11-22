// controllers/TaxInfoController.js
const TaxInfo = require('../models/TaxInfo');

exports.createTaxInfo = async (req, res) => {
    try {
      const { user_id, name, address, phone, taxId, customerType } = req.body;
      const documentPath = req.file ? `/storage/tax/tax_file/${req.file.filename}` : '';
  
      const newTaxInfo = new TaxInfo({
        user_id,
        name,
        address,
        phone,
        taxId,
        customerType,
        document: documentPath
      });
  
      const savedTaxInfo = await newTaxInfo.save();
      res.status(201).json(savedTaxInfo);
    } catch (error) {
      console.error('Error creating tax information:', error);
      res.status(500).json({ error: error.message });
    }
  };

exports.getAllTaxInfo = async (req, res) => {
  try {
    const taxInfos = await TaxInfo.find();
    res.json(taxInfos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tax information' });
  }
};

exports.updateTaxInfo = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      
      if (req.file) {
        updateData.document = `/storage/tax/tax_file/${req.file.filename}`;
      }
  
      const updatedTaxInfo = await TaxInfo.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedTaxInfo) {
        return res.status(404).json({ error: 'Tax information not found' });
      }
  
      res.json(updatedTaxInfo);
    } catch (err) {
      console.error('Error updating tax information:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

exports.deleteTaxInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTaxInfo = await TaxInfo.findByIdAndDelete(id);
    if (!deletedTaxInfo) {
      return res.status(404).json({ error: 'Tax information not found' });
    }

    res.json({ message: 'Tax information deleted successfully' });
  } catch (err) {
    console.error('Error deleting tax information:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTaxInfoByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const taxInfos = await TaxInfo.find({ user_id: userId });
    res.json(taxInfos);
  } catch (error) {
    console.error('Error fetching tax information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};