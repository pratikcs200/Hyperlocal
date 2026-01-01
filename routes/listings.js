const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/listings - Get nearby listings
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius = process.env.DEFAULT_RADIUS_KM, category } = req.query;
    
    let query = { status: 'active' };
    
    // Add location-based search if coordinates provided
    if (lat && lng) {
      const radiusInMeters = radius * 1000; // Convert km to meters
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radiusInMeters
        }
      };
    }
    
    // Add category filter if provided
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const listings = await Listing.find(query)
      .populate('userId', 'name rating')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/listings/:id - Get single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('userId', 'name rating email');
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/listings - Create new listing
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, price, category, latitude, longitude } = req.body;
    
    // Get uploaded image paths
    const images = req.files ? req.files.map(file => file.filename) : [];
    
    const listing = new Listing({
      userId: req.user._id,
      title,
      description,
      price: parseFloat(price),
      category,
      images,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    });
    
    await listing.save();
    await listing.populate('userId', 'name rating');
    
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/listings/:id - Update listing (owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check ownership
    if (listing.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { title, description, price, category, status } = req.body;
    
    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.price = price || listing.price;
    listing.category = category || listing.category;
    listing.status = status || listing.status;
    
    await listing.save();
    await listing.populate('userId', 'name rating');
    
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/listings/:id - Delete listing (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check ownership
    if (listing.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/listings/:id/images - Update listing with new images
router.put('/:id/images', auth, upload.array('images', 5), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check ownership
    if (listing.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { title, description, price, category, status } = req.body;
    const existingImages = req.body.existingImages || [];
    
    // Get new uploaded image paths
    const newImages = req.files ? req.files.map(file => file.filename) : [];
    
    // Combine existing and new images
    const allImages = Array.isArray(existingImages) ? existingImages : [existingImages];
    const finalImages = [...allImages.filter(img => img), ...newImages];
    
    // Update listing
    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.price = price || listing.price;
    listing.category = category || listing.category;
    listing.status = status || listing.status;
    listing.images = finalImages;
    
    await listing.save();
    await listing.populate('userId', 'name rating');
    
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;