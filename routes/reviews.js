const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// GET /api/reviews/:userId - Get reviews for a user
router.get('/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ revieweeId: req.params.userId })
      .populate('reviewerId', 'name')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/reviews - Create new review
router.post('/', auth, async (req, res) => {
  try {
    const { revieweeId, rating, comment } = req.body;
    
    // Check if reviewer already reviewed this user
    const existingReview = await Review.findOne({
      reviewerId: req.user._id,
      revieweeId
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this user' });
    }
    
    // Cannot review yourself
    if (revieweeId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot review yourself' });
    }
    
    const review = new Review({
      reviewerId: req.user._id,
      revieweeId,
      rating: parseInt(rating),
      comment
    });
    
    await review.save();
    
    // Update user's average rating
    const userReviews = await Review.find({ revieweeId });
    const avgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
    
    await User.findByIdAndUpdate(revieweeId, { rating: avgRating });
    
    await review.populate('reviewerId', 'name');
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/reviews/:id - Update review (reviewer only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check ownership
    if (review.reviewerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    
    await review.save();
    
    // Update user's average rating
    const userReviews = await Review.find({ revieweeId: review.revieweeId });
    const avgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
    
    await User.findByIdAndUpdate(review.revieweeId, { rating: avgRating });
    
    await review.populate('reviewerId', 'name');
    
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/reviews/:id - Delete review (reviewer only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check ownership
    if (review.reviewerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const revieweeId = review.revieweeId;
    await Review.findByIdAndDelete(req.params.id);
    
    // Update user's average rating
    const userReviews = await Review.find({ revieweeId });
    const avgRating = userReviews.length > 0 
      ? userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length 
      : 0;
    
    await User.findByIdAndUpdate(revieweeId, { rating: avgRating });
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;