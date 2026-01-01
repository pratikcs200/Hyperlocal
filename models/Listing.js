const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'furniture', 'clothing', 'books', 'sports', 'other']
  },
  images: [{
    type: String // File paths to uploaded images
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'pending', 'rejected'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create 2dsphere index for location-based queries
listingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Listing', listingSchema);