const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Listing = require('./models/Listing');
const Service = require('./models/Service');
const Review = require('./models/Review');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Service.deleteMany({});
    await Review.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      rating: 5.0,
      location: {
        type: 'Point',
        coordinates: [77.1025, 28.7041] // Delhi coordinates
      }
    });
    await admin.save();

    // Create regular users
    console.log('Creating regular users...');
    const user1PasswordHash = await bcrypt.hash('password123', 10);
    const user1 = new User({
      name: 'John Smith',
      email: 'john@example.com',
      passwordHash: user1PasswordHash,
      role: 'user',
      rating: 4.2,
      location: {
        type: 'Point',
        coordinates: [72.8777, 19.0760] // Mumbai coordinates
      }
    });
    await user1.save();

    const user2PasswordHash = await bcrypt.hash('password123', 10);
    const user2 = new User({
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      passwordHash: user2PasswordHash,
      role: 'user',
      rating: 4.8,
      location: {
        type: 'Point',
        coordinates: [77.5946, 12.9716] // Bangalore coordinates
      }
    });
    await user2.save();

    // Create sample listings
    console.log('Creating sample listings...');
    const listings = [
      {
        userId: user1._id,
        title: 'iPhone 13 Pro - Excellent Condition',
        description: 'Barely used iPhone 13 Pro in excellent condition. Comes with original box, charger, and screen protector already applied. No scratches or dents. Battery health at 98%. Perfect for someone looking for a premium phone at a great price.',
        price: 45000,
        category: 'electronics',
        images: [], // In real app, you'd have actual image files
        location: {
          type: 'Point',
          coordinates: [72.8777, 19.0760] // Mumbai
        },
        status: 'active'
      },
      {
        userId: user2._id,
        title: 'Vintage Leather Sofa',
        description: 'Beautiful vintage leather sofa in great condition. Perfect for a living room or office. Comfortable seating for 3 people. Some minor wear that adds to its character. Must pick up due to size.',
        price: 25000,
        category: 'furniture',
        images: [],
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716] // Bangalore
        },
        status: 'active'
      },
      {
        userId: user1._id,
        title: 'Mountain Bike - Trek X-Caliber',
        description: 'Trek X-Caliber mountain bike in good condition. Great for trails and city riding. Recently serviced with new brake pads and chain. Includes helmet and water bottle holder.',
        price: 18000,
        category: 'sports',
        images: [],
        location: {
          type: 'Point',
          coordinates: [73.8567, 18.5204] // Pune
        },
        status: 'active'
      },
      {
        userId: user2._id,
        title: 'Programming Books Collection',
        description: 'Collection of programming books including JavaScript, Python, and React. All books are in excellent condition with minimal highlighting. Perfect for someone learning to code or expanding their knowledge.',
        price: 4500,
        category: 'books',
        images: [],
        location: {
          type: 'Point',
          coordinates: [80.2707, 13.0827] // Chennai
        },
        status: 'active'
      },
      {
        userId: user1._id,
        title: 'Designer Winter Jacket',
        description: 'North Face winter jacket, size Medium. Worn only a few times. Perfect for cold weather with excellent insulation. No stains or damage. Retail price was $200.',
        price: 8000,
        category: 'clothing',
        images: [],
        location: {
          type: 'Point',
          coordinates: [78.4867, 17.3850] // Hyderabad
        },
        status: 'active'
      }
    ];

    for (const listingData of listings) {
      const listing = new Listing(listingData);
      await listing.save();
    }

    // Create sample services
    console.log('Creating sample services...');
    const services = [
      {
        userId: user1._id,
        title: 'Web Development Services',
        description: 'Professional web development services including React, Node.js, and database design. I can help build your website from scratch or improve existing applications. Portfolio available upon request.',
        category: 'other',
        availability: 'Weekdays 9 AM - 6 PM, Weekends by appointment',
        location: {
          type: 'Point',
          coordinates: [88.3639, 22.5726] // Kolkata
        },
        status: 'active'
      },
      {
        userId: user2._id,
        title: 'House Cleaning Service',
        description: 'Professional house cleaning service with 5+ years experience. I provide thorough cleaning including bathrooms, kitchens, bedrooms, and common areas. Eco-friendly products available.',
        category: 'cleaning',
        availability: 'Monday to Friday, 8 AM - 4 PM',
        location: {
          type: 'Point',
          coordinates: [75.7873, 26.9124] // Jaipur
        },
        status: 'active'
      },
      {
        userId: user1._id,
        title: 'Math and Science Tutoring',
        description: 'Experienced tutor offering help with high school and college level math and science. Specializing in calculus, physics, and chemistry. Can meet in person or online.',
        category: 'tutoring',
        availability: 'Evenings and weekends',
        location: {
          type: 'Point',
          coordinates: [72.5714, 23.0225] // Ahmedabad
        },
        status: 'active'
      }
    ];

    for (const serviceData of services) {
      const service = new Service(serviceData);
      await service.save();
    }

    // Create sample reviews
    console.log('Creating sample reviews...');
    const reviews = [
      {
        reviewerId: user2._id,
        revieweeId: user1._id,
        rating: 5,
        comment: 'Excellent seller! The iPhone was exactly as described and the transaction was smooth. Highly recommended!'
      },
      {
        reviewerId: user1._id,
        revieweeId: user2._id,
        rating: 4,
        comment: 'Great communication and fast response. The sofa was in good condition as promised. Would buy from again.'
      },
      {
        reviewerId: admin._id,
        revieweeId: user1._id,
        rating: 4,
        comment: 'Professional and reliable. The tutoring session was very helpful and well-structured.'
      },
      {
        reviewerId: admin._id,
        revieweeId: user2._id,
        rating: 5,
        comment: 'Outstanding cleaning service! Very thorough and professional. My house has never looked better.'
      }
    ];

    for (const reviewData of reviews) {
      const review = new Review(reviewData);
      await review.save();
    }

    // Update user ratings based on reviews
    console.log('Updating user ratings...');
    const users = await User.find({ role: 'user' });
    
    for (const user of users) {
      const userReviews = await Review.find({ revieweeId: user._id });
      if (userReviews.length > 0) {
        const avgRating = userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length;
        user.rating = avgRating;
        await user.save();
      }
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Seeded Data Summary:');
    console.log(`👤 Users: ${await User.countDocuments()}`);
    console.log(`📦 Listings: ${await Listing.countDocuments()}`);
    console.log(`🔧 Services: ${await Service.countDocuments()}`);
    console.log(`⭐ Reviews: ${await Review.countDocuments()}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin@example.com / Admin@123');
    console.log('User 1: john@example.com / password123');
    console.log('User 2: sarah@example.com / password123');
    
    console.log('\n🌍 All users are located in major Indian cities for testing location-based features.');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();