const Tracking = require('../models/Tracking');
const Lot = require('../models/Lot');

// Helper functions
const calculateModeDates = async (lotId) => {
  const trackings = await Tracking.find({ lot_id: lotId });
  
  const getModeDate = (dates) => {
    const frequency = dates.filter(date => date)
      .reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

    if (Object.keys(frequency).length === 0) return '';
    return Object.entries(frequency)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };

  return {
    in_cn: getModeDate(trackings.map(t => t.in_cn)),
    out_cn: getModeDate(trackings.map(t => t.out_cn)),
    in_th: getModeDate(trackings.map(t => t.in_th))
  };
};

const updateLotDates = async (lotId) => {
  if (!lotId) return;
  
  const modeDates = await calculateModeDates(lotId);
  
  await Lot.findOneAndUpdate(
    { lot_id: lotId },
    {
      in_cn: modeDates.in_cn,
      out_cn: modeDates.out_cn,
      in_th: modeDates.in_th
    }
  );
};

// Main controller methods
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
  const { lotId } = req.params;

  try {
    const trackingData = await Tracking.find({ lot_id: lotId });
    if (trackingData.length === 0) {
      return res.json([]);
    }
    res.json(trackingData);
  } catch (err) {
    console.error('Error fetching tracking data:', err);
    res.status(500).json({ error: 'Failed to fetch tracking data' });
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
    pricing,
    cal_price,
    type_cal,
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
      lot_type: otherFields.lot_type || 'รถ',
      type_item: otherFields.type_item || '',
      crate: crate === 'true' ? 'ตี' : 'ไม่ตี',
      check_product: check_product === 'true' ? 'เช็ค' : 'ไม่เช็ค',
      weight: parseFloat(otherFields.weight) || 0,
      wide: parseFloat(otherFields.wide) || 0,
      high: parseFloat(otherFields.high) || 0,
      long: parseFloat(otherFields.long) || 0,
      number: parseInt(number, 10) || 0,
      pricing: otherFields.pricing || 'อัตโนมัติ',
      cal_price: parseFloat(cal_price) || 0,
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
      image_item_paths,
      type_cal: type_cal || 'weightPrice'
    });

    const savedTracking = await newTracking.save();

    // Update lot dates if tracking is assigned to a lot
    if (savedTracking.lot_id) {
      await updateLotDates(savedTracking.lot_id);
    }

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

    const oldLotId = existingTracking.lot_id;

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

    const updatedData = {
      ...updateData,
      not_owner: updateData.not_owner === 'true',
      crate: updateData.crate === 'true' ? 'ตี' : 'ไม่ตี',
      check_product: updateData.check_product === 'true' ? 'เช็ค' : 'ไม่เช็ค',
      transport_file_path,
      image_item_paths,
      cal_price: parseFloat(updateData.cal_price) || 0,
      type_cal: updateData.type_cal || 'weightPrice'
    };

    const updatedTracking = await Tracking.findOneAndUpdate(
      { tracking_id: trackingId },
      updatedData,
      { new: true }
    );

    // Update lot dates for both old and new lots if they're different
    if (oldLotId) {
      await updateLotDates(oldLotId);
    }
    if (updatedTracking.lot_id && updatedTracking.lot_id !== oldLotId) {
      await updateLotDates(updatedTracking.lot_id);
    }

    res.json(updatedTracking);
  } catch (err) {
    console.error('Error updating tracking:', err);
    res.status(500).json({ error: 'Failed to update tracking' });
  }
};

exports.updateTrackingFields = async (req, res) => {
  const { trackingId } = req.params;
  const updateFields = req.body;

  try {
    const existingTracking = await Tracking.findOne({ tracking_id: trackingId });

    if (!existingTracking) {
      return res.status(404).json({ error: "Tracking not found" });
    }

    // Dynamically calculate the new status
    let newStatus = "wait_cn";
    if (updateFields.in_th || existingTracking.in_th) newStatus = "in_th";
    else if (updateFields.out_cn || existingTracking.out_cn) newStatus = "out_cn";
    else if (updateFields.in_cn || existingTracking.in_cn) newStatus = "in_cn";

    updateFields.status = newStatus;

    const updatedTracking = await Tracking.findOneAndUpdate(
      { tracking_id: trackingId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedTracking) {
      return res.status(404).json({ error: "Tracking not found" });
    }

    // Update the lot dates if this tracking belongs to a lot
    if (updatedTracking.lot_id) {
      await updateLotDates(updatedTracking.lot_id);
    }

    res.json(updatedTracking);
  } catch (err) {
    console.error("Error updating tracking:", err);
    res.status(500).json({ error: "Failed to update tracking" });
  }
};

exports.updateLotId = async (req, res) => {
  const { trackingId } = req.params;
  const { newLotId } = req.body;

  try {
    const existingTracking = await Tracking.findOne({ tracking_id: trackingId });
    const oldLotId = existingTracking ? existingTracking.lot_id : null;

    const lastTracking = await Tracking.findOne({ lot_id: newLotId })
      .sort({ lot_order: -1 })
      .select('lot_order');

    let nextLotOrder = lastTracking && lastTracking.lot_order ? 
      String(parseInt(lastTracking.lot_order, 10) + 1) : '1';

    const updatedTracking = await Tracking.findOneAndUpdate(
      { tracking_id: trackingId },
      { $set: { lot_id: newLotId, lot_order: nextLotOrder } },
      { new: true }
    );

    if (!updatedTracking) {
      return res.status(404).json({ error: 'Tracking not found' });
    }

    // Update dates for both old and new lots
    if (oldLotId) {
      await updateLotDates(oldLotId);
    }
    await updateLotDates(newLotId);

    res.json(updatedTracking);
  } catch (err) {
    console.error('Error updating lot_id:', err);
    res.status(500).json({ error: 'Failed to update lot_id' });
  }
};

exports.removeFromLot = async (req, res) => {
  try {
    const existingTracking = await Tracking.findOne({ tracking_id: req.params.trackingId });
    const oldLotId = existingTracking ? existingTracking.lot_id : null;

    const tracking = await Tracking.findOneAndUpdate(
      { tracking_id: req.params.trackingId },
      {
        $set: {
          lot_id: null,
          lot_order: null,
          in_cn: null,
          out_cn: null,
          in_th: null,
          status: "wait_cn",
        },
      },
      { new: true }
    );

    if (!tracking) {
      return res.status(404).json({ error: "Tracking not found" });
    }

    // Update the dates for the lot the tracking was removed from
    if (oldLotId) {
      await updateLotDates(oldLotId);
    }

    res.json(tracking);
  } catch (err) {
    console.error("Error removing from lot:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.resetDates = async (req, res) => {
  try {
    const tracking = await Tracking.findOneAndUpdate(
      { tracking_id: req.params.trackingId },
      {
        $set: {
          in_cn: null,
          out_cn: null,
          in_th: null,
          status: "wait_cn",
        },
      },
      { new: true }
    );

    if (!tracking) {
      return res.status(404).json({ error: "Tracking not found" });
    }

    // Update the lot dates if this tracking belongs to a lot
    if (tracking.lot_id) {
      await updateLotDates(tracking.lot_id);
    }

    res.json(tracking);
  } catch (err) {
    console.error("Error resetting dates:", err);
    res.status(500).json({ error: err.message });
  }
};

// Add this method to your TrackingController
exports.getLotDates = async (req, res) => {
  const { lotId } = req.params;

  try {
    // Get all tracking records for this lot
    const trackingData = await Tracking.find({ lot_id: lotId });

    // Helper function to get mode date
    const getModeDate = (dates) => {
      // Filter out null/undefined values and create frequency map
      const frequency = dates.filter(date => date)
        .reduce((acc, date) => {
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

      // If no valid dates, return null
      if (Object.keys(frequency).length === 0) return null;

      // Find the mode (date with highest frequency)
      return Object.entries(frequency)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
    };

    // Calculate mode dates
    const dates = {
      in_cn: getModeDate(trackingData.map(t => t.in_cn)),
      out_cn: getModeDate(trackingData.map(t => t.out_cn)),
      in_th: getModeDate(trackingData.map(t => t.in_th))
    };

    res.json(dates);
  } catch (err) {
    console.error('Error calculating lot dates:', err);
    res.status(500).json({ error: 'Failed to calculate lot dates' });
  }
};