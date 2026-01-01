const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { auth } = require('../middleware/auth');

// GET /api/messages - Get conversations
router.get('/', auth, async (req, res) => {
  try {
    const { userId } = req.query; // Get messages with specific user
    const currentUserId = req.user._id;
    
    let query = {
      $or: [
        { senderId: currentUserId },
        { receiverId: currentUserId }
      ]
    };
    
    // If userId provided, get conversation with that specific user only
    if (userId) {
      query = {
        $or: [
          { senderId: currentUserId, receiverId: userId },
          { senderId: userId, receiverId: currentUserId }
        ]
      };
    }
    
    const messages = await Message.find(query)
      .populate('senderId', 'name')
      .populate('receiverId', 'name')
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json(messages.reverse()); // Reverse to show oldest first
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/messages/conversations - Get list of conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    // Use a more secure approach to get conversations
    const userId = req.user._id;
    
    const conversations = await Message.aggregate([
      {
        // CRITICAL: Only match messages where current user is sender OR receiver
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        // Group by the OTHER user (not the current user)
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', userId] },
              '$receiverId',  // If current user is sender, group by receiver
              '$senderId'     // If current user is receiver, group by sender
            ]
          },
          lastMessage: { $first: '$text' },
          lastMessageDate: { $first: '$createdAt' },
          lastSenderId: { $first: '$senderId' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiverId', userId] }, // Only count unread messages TO current user
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        // Lookup user details for the OTHER user
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        // Filter out any null users or conversations with self
        $match: {
          '_id': { $ne: userId }, // Don't include conversations with self
          'user': { $exists: true }
        }
      },
      {
        $project: {
          userId: '$_id',
          userName: '$user.name',
          userEmail: '$user.email',
          lastMessage: 1,
          lastMessageDate: 1,
          lastSenderId: 1,
          unreadCount: 1,
          isLastMessageFromMe: { $eq: ['$lastSenderId', userId] }
        }
      },
      {
        $sort: { lastMessageDate: -1 }
      }
    ]);
    
    res.json(conversations);
  } catch (error) {
    console.error('Conversations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/messages - Send new message
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    
    const message = new Message({
      senderId: req.user._id,
      receiverId,
      text
    });
    
    await message.save();
    await message.populate([
      { path: 'senderId', select: 'name' },
      { path: 'receiverId', select: 'name' }
    ]);
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/messages/:id/read - Mark message as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Only receiver can mark as read
    if (message.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    message.read = true;
    await message.save();
    
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;