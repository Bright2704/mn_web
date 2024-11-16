const Tracking = require('../models/Tracking');

exports.getAllTracking = async (req, res) => {
  try {
    const trackingData = await Tracking.find();
    res.json(trackingData);
  } catch (err) {
    console.error('Error fetching tracking data:', err);
    res.status(500).json({ error: 'Failed to fetch tracking data' });
  }
};

exports.searchTracking = async (req, res) => {
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
};

exports.createTracking = async (req, res, files) => {
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
    ...otherFields
  } = req.body;

  let transport_file_path = '';
  let image_item_paths = [];

  if (files['trackingFile'] && files['trackingFile'][0]) {
    transport_file_path = `/storage/tracking/tracking_file/${files['trackingFile'][0].filename}`;
  }

  if (files['trackingImages']) {
    image_item_paths = files['trackingImages'].map(file => 
      `/storage/tracking/tracking_image/${file.filename}`
    );
  }

  try {
    const newTracking = new Tracking({
      user_id,
      not_owner: not_owner === 'true',
      tracking_id,
      buylist_id,
      mnemonics,
      lot_type,
      type_item: otherFields.type_item || '',
      crate: crate === 'true' ? 'ตี' : 'ไม่ตี',
      check_product: check_product === 'true' ? 'เช็ค' : 'ไม่เช็ค',
      weight: parseFloat(otherFields.weight) || 0,
      wide: parseFloat(otherFields.wide) || 0,
      high: parseFloat(otherFields.high) || 0,
      long: parseFloat(otherFields.long) || 0,
      number: parseInt(number, 10) || 0,
      pricing: otherFields.pricing || '',
      cal_price: parseFloat(otherFields.cal_price) || 0,
      user_rate: otherFields.user_rate || 'A',
      in_cn: otherFields.in_cn || '',
      out_cn: otherFields.out_cn || '',
      in_th: otherFields.in_th || '',
      check_product_price: parseFloat(otherFields.check_product_price) || 0,
      new_wrap: parseFloat(otherFields.new_wrap) || 0,
      transport: parseFloat(otherFields.transport) || 0,
      price_crate: parseFloat(otherFields.price_crate) || 0,
      other: otherFields.other || '',
      status: otherFields.status || 'รอเข้าโกดังจีน',
      lot_id: otherFields.lot_id || '',
      lot_order: otherFields.lot_order || '',
      transport_file_path,
      image_item_paths
    });

    const savedTracking = await newTracking.save();
    res.status(201).json(savedTracking);
  } catch (err) {
    console.error('Error creating tracking:', err);
    res.status(500).json({ error: 'Failed to create tracking' });
  }
};

exports.updateTracking = async (req, res, files) => {
  const { trackingId } = req.params;
  const updateData = { ...req.body };

  try {
    const existingTracking = await Tracking.findOne({ tracking_id: trackingId });
    if (!existingTracking) {
      return res.status(404).json({ error: 'Tracking not found' });
    }

    // Handle file paths
    let transport_file_path = existingTracking.transport_file_path;
    let image_item_paths = existingTracking.image_item_paths;

    if (files['trackingFile'] && files['trackingFile'][0]) {
      transport_file_path = `/storage/tracking/tracking_file/${files['trackingFile'][0].filename}`;
    }

    if (files['trackingImages']) {
      image_item_paths = files['trackingImages'].map(file => 
        `/storage/tracking/tracking_image/${file.filename}`
      );
    }

    // Prepare update data
    const updatedData = {
      ...updateData,
      not_owner: updateData.not_owner === 'true',
      crate: updateData.crate === 'true' ? 'ตี' : 'ไม่ตี',
      check_product: updateData.check_product === 'true' ? 'เช็ค' : 'ไม่เช็ค',
      transport_file_path,
      image_item_paths
    };

    const updatedTracking = await Tracking.findOneAndUpdate(
      { tracking_id: trackingId },
      updatedData,
      { new: true }
    );

    res.json(updatedTracking);
  } catch (err) {
    console.error('Error updating tracking:', err);
    res.status(500).json({ error: 'Failed to update tracking' });
  }
};

exports.getTrackingById = async (req, res) => {
  try {
    const tracking = await Tracking.findOne({ tracking_id: req.params.trackingId });
    if (!tracking) {
      return res.status(404).json({ error: 'Tracking not found' });
    }
    res.json(tracking);
  } catch (err) {
    console.error('Error fetching tracking details:', err);
    res.status(500).json({ error: 'Failed to fetch tracking details' });
  }
};

exports.getTrackingByLotId = async (req, res) => {
  try {
    const trackingData = await Tracking.find({ lot_id: req.params.lotId });
    if (trackingData.length === 0) {
      return res.status(404).json({ message: 'No tracking data found for this lot_id' });
    }
    res.json(trackingData);
  } catch (err) {
    console.error('Error fetching tracking data:', err);
    res.status(500).json({ error: 'Failed to fetch tracking data' });
  }
};

exports.updateTrackingFields = async (req, res) => {
  const { trackingId } = req.params;
  const updateFields = req.body;

  try {
    const updatedTracking = await Tracking.findOneAndUpdate(
      { tracking_id: trackingId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedTracking) {
      return res.status(404).json({ error: 'Tracking not found' });
    }

    res.json(updatedTracking);
  } catch (err) {
    console.error('Error updating tracking:', err);
    res.status(500).json({ error: 'Failed to update tracking' });
  }
};

exports.updateLotId = async (req, res) => {
  const { trackingId } = req.params;
  const { newLotId } = req.body;

  try {
    const updatedTracking = await Tracking.findOneAndUpdate(
      { tracking_id: trackingId },
      { $set: { lot_id: newLotId } },
      { new: true }
    );

    if (!updatedTracking) {
      return res.status(404).json({ error: 'Tracking not found' });
    }

    res.json(updatedTracking);
  } catch (err) {
    console.error('Error updating lot_id:', err);
    res.status(500).json({ error: 'Failed to update lot_id' });
  }
};