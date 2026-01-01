const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Listing = require('../models/Listing');
const { auth } = require('../middleware/auth');

// GET /api/orders/seller - Get orders for seller's items
router.get('/seller', auth, async (req, res) => {
  try {
    // Find all orders that contain items sold by the current user
    const orders = await Order.find({
      'items.sellerId': req.user._id
    })
      .populate('userId', 'name email')
      .populate('items.listingId', 'title images')
      .sort({ createdAt: -1 });
    
    // Filter orders to only include items sold by current user
    const filteredOrders = orders.map(order => {
      const userItems = order.items.filter(item => 
        item.sellerId.toString() === req.user._id.toString()
      );
      
      // Calculate total amount for user's items only
      const userTotalAmount = userItems.reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );
      
      return {
        ...order.toObject(),
        items: userItems,
        totalAmount: userTotalAmount
      };
    }).filter(order => order.items.length > 0); // Only include orders with user's items
    
    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/orders - Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.listingId', 'title images')
      .populate('items.sellerId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/orders/:id - Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.listingId', 'title images')
      .populate('items.sellerId', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user has permission to view this order
    const isBuyer = order.userId._id.toString() === req.user._id.toString();
    const isSeller = order.items.some(item => 
      item.sellerId._id.toString() === req.user._id.toString()
    );
    const isAdmin = req.user.role === 'admin';
    
    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/orders/checkout - Create order from cart
router.post('/checkout', auth, async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    
    // Validate shipping address
    const requiredFields = ['fullName', 'address', 'city', 'state', 'pincode', 'phone'];
    for (const field of requiredFields) {
      if (!shippingAddress[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }
    
    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.listingId');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Validate all items are still available
    const orderItems = [];
    let totalAmount = 0;
    
    for (const cartItem of cart.items) {
      const listing = cartItem.listingId;
      
      if (!listing || listing.status !== 'active') {
        return res.status(400).json({ 
          message: `Item "${listing?.title || 'Unknown'}" is no longer available` 
        });
      }
      
      const orderItem = {
        listingId: listing._id,
        title: listing.title,
        price: listing.price,
        quantity: cartItem.quantity,
        sellerId: listing.userId
      };
      
      orderItems.push(orderItem);
      totalAmount += listing.price * cartItem.quantity;
    }
    
    // Create order
    const order = new Order({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress
    });
    
    await order.save();
    
    // Clear cart after successful order
    await Cart.findOneAndDelete({ userId: req.user._id });
    
    // Update listing status to sold (for single quantity items)
    for (const item of orderItems) {
      await Listing.findByIdAndUpdate(item.listingId, { status: 'sold' });
    }
    
    await order.populate([
      { path: 'items.listingId', select: 'title images' },
      { path: 'items.sellerId', select: 'name email' }
    ]);
    
    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/orders/:id/status - Update order status (for sellers/admin)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.listingId', 'title');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is seller of any item in the order or admin
    const user = req.user;
    const isSeller = order.items.some(item => 
      item.sellerId.toString() === user._id.toString()
    );
    
    if (!isSeller && user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }
    
    // Validate status transitions
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['shipped', 'cancelled'],
      'shipped': ['delivered'],
      'delivered': [], // Final state
      'cancelled': [] // Final state
    };
    
    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({ 
        message: `Cannot change status from ${order.status} to ${status}` 
      });
    }
    
    order.status = status;
    await order.save();
    
    // Send notification to buyer (in a real app, you'd send email/SMS)
    console.log(`Order ${order._id} status updated to ${status} by seller ${user.name}`);
    console.log(`Buyer ${order.userId.name} (${order.userId.email}) should be notified`);
    
    res.json({ 
      message: 'Order status updated successfully', 
      order: {
        _id: order._id,
        status: order.status,
        buyerName: order.userId.name,
        buyerEmail: order.userId.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;