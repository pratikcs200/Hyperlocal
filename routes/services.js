const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { auth } = require('../middleware/auth');

// GET /api/services - Get nearby services
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius = process.env.DEFAULT_RADIUS_KM, category } = req.query;
    
    let query = { status: 'active' };
    
    // Add location-based search if coordinates provided
    if (lat && lng) {
      const radiusInMeters = radius * 1000;
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
    
    const services = await Service.find(query)
      .populate('userId', 'name rating')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/services/:id - Get single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('userId', 'name rating email');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/services - Create new service
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, availability, latitude, longitude } = req.body;
    
    const service = new Service({
      userId: req.user._id,
      title,
      description,
      category,
      availability,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    });
    
    await service.save();
    await service.populate('userId', 'name rating');
    
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/services/:id - Update service (owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Check ownership
    if (service.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { title, description, category, availability, status } = req.body;
    
    service.title = title || service.title;
    service.description = description || service.description;
    service.category = category || service.category;
    service.availability = availability || service.availability;
    service.status = status || service.status;
    
    await service.save();
    await service.populate('userId', 'name rating');
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/services/:id - Delete service (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Check ownership
    if (service.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;