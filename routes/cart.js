const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Listing = require('../models/Listing');
const { auth } = require('../middleware/auth');

// GET /api/cart - Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate({
        path: 'items.listingId',
        populate: {
          path: 'userId',
          select: 'name rating'
        }
      });
    
    if (!cart) {
      return res.json({ items: [], totalAmount: 0 });
    }
    
    // Filter out items where listing no longer exists
    const validItems = cart.items.filter(item => item.listingId);
    
    // Calculate total amount
    const totalAmount = validItems.reduce((total, item) => {
      return total + (item.listingId.price * item.quantity);
    }, 0);
    
    res.json({
      items: validItems,
      totalAmount: totalAmount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/cart/add - Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { listingId, quantity = 1 } = req.body;
    
    // Check if listing exists and is active
    const listing = await Listing.findById(listingId);
    if (!listing || listing.status !== 'active') {
      return res.status(400).json({ message: 'Listing not available' });
    }
    
    // Don't allow users to add their own listings to cart
    if (listing.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot add your own listing to cart' });
    }
    
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId: req.user._id,
        items: [{ listingId, quantity }]
      });
    } else {
      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.listingId.toString() === listingId
      );
      
      if (existingItemIndex > -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({ listingId, quantity });
      }
    }
    
    await cart.save();
    await cart.populate({
      path: 'items.listingId',
      populate: {
        path: 'userId',
        select: 'name rating'
      }
    });
    
    res.json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/cart/update - Update item quantity in cart
router.put('/update', auth, async (req, res) => {
  try {
    const { listingId, quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.listingId.toString() === listingId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/cart/remove - Remove item from cart
router.delete('/remove/:listingId', auth, async (req, res) => {
  try {
    const { listingId } = req.params;
    
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(
      item => item.listingId.toString() !== listingId
    );
    
    await cart.save();
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/cart/clear - Clear entire cart
router.delete('/clear', auth, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user._id });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;