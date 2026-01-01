const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const { auth } = require('../middleware/auth');

// GET /api/requests - Get user's requests (sent and received)
router.get('/', auth, async (req, res) => {
  try {
    const { type } = req.query; // 'sent' or 'received'
    
    let query = {};
    if (type === 'sent') {
      query.buyerId = req.user._id;
    } else if (type === 'received') {
      query.sellerId = req.user._id;
    } else {
      // Get both sent and received
      query = {
        $or: [
          { buyerId: req.user._id },
          { sellerId: req.user._id }
        ]
      };
    }
    
    const requests = await Request.find(query)
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .populate('listingId', 'title price')
      .populate('serviceId', 'title')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/requests - Create new request
router.post('/', auth, async (req, res) => {
  try {
    const { sellerId, listingId, serviceId, message } = req.body;
    
    // Check if request already exists
    const existingRequest = await Request.findOne({
      buyerId: req.user._id,
      sellerId,
      $or: [
        { listingId: listingId || null },
        { serviceId: serviceId || null }
      ]
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: 'Request already exists' });
    }
    
    const request = new Request({
      buyerId: req.user._id,
      sellerId,
      listingId: listingId || undefined,
      serviceId: serviceId || undefined,
      message
    });
    
    await request.save();
    await request.populate([
      { path: 'buyerId', select: 'name email' },
      { path: 'sellerId', select: 'name email' },
      { path: 'listingId', select: 'title price' },
      { path: 'serviceId', select: 'title' }
    ]);
    
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/requests/:id - Update request status (seller only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Only seller can update status
    if (request.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    request.status = status;
    await request.save();
    
    await request.populate([
      { path: 'buyerId', select: 'name email' },
      { path: 'sellerId', select: 'name email' },
      { path: 'listingId', select: 'title price' },
      { path: 'serviceId', select: 'title' }
    ]);
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;