const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const Service = require('../models/Service');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

// GET /api/admin/stats - Get admin dashboard stats
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const totalServices = await Service.countDocuments();
    const activeListings = await Listing.countDocuments({ status: 'active' });
    
    res.json({
      totalUsers,
      totalListings,
      totalServices,
      activeListings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/admin/listings - Get all listings for moderation
router.get('/listings', auth, adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const listings = await Listing.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Listing.countDocuments(query);
    
    res.json({
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/admin/users - Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments();
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/admin/listings/:id/approve - Approve listing
router.put('/listings/:id/approve', auth, adminAuth, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: 'active' },
      { new: true }
    ).populate('userId', 'name email');
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    res.json({ message: 'Listing approved', listing });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/admin/listings/:id/reject - Reject listing
router.put('/listings/:id/reject', auth, adminAuth, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).populate('userId', 'name email');
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    res.json({ message: 'Listing rejected', listing });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/admin/listings/:id - Delete listing
router.delete('/listings/:id', auth, adminAuth, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;