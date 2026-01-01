# Hyperlocal Community Marketplace

A responsive local marketplace web application where users can buy/sell items, offer services, chat with each other, and leave reviews. Built with Node.js, Express, MongoDB, and vanilla JavaScript with modern responsive design.

## 🚀 Features

- **Location-based Search**: Find items and services near you using geolocation
- **User Authentication**: Secure registration and login with JWT tokens
- **Listings Management**: Create, view, edit, and delete item listings
- **Shopping Cart**: Add items to cart and checkout with shipping details
- **Order Management**: Place orders and track order status
- **Services Marketplace**: Offer and find local services
- **Real-time Messaging**: Chat with buyers and sellers
- **Review System**: Rate and review other users
- **Image Upload**: Upload multiple images for listings
- **Admin Panel**: Moderate listings and manage users
- **Update Notifications**: Get notified when new content is available
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Indian Rupee Support**: All prices displayed in INR (₹)

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Security**: bcryptjs for password hashing
- **Responsive**: Mobile-first design with CSS Grid and Flexbox

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB installation)
- A modern web browser

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY-NAME.git
cd YOUR-REPOSITORY-NAME
```

*Replace YOUR-USERNAME and YOUR-REPOSITORY-NAME with your actual GitHub details*

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your MongoDB connection string:

```env
PORT=4000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hyperlocal-marketplace
JWT_SECRET=9b8f72d0196cffb57b33646a7b32b0f81f3342a13c4895110d4e9a2d9a87e8798d16f4d8d3d37c8b2c0fe2f995e50669a380ee6605420939f6c627500c366837
DEFAULT_RADIUS_KM=10
```

**Important**: Replace `MONGO_URI` with your actual MongoDB Atlas connection string:
1. Go to your MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string and replace `<password>` with your database password
5. Replace `<dbname>` with your preferred database name (e.g., `hyperlocal-marketplace`)

### 4. Seed the Database

Run the seed script to populate your database with sample data:

```bash
npm run seed
```

This will create:
- 1 admin user
- 2 regular users
- 5 sample listings
- 3 sample services
- Sample reviews

### 5. Start the Application

```bash
npm start
```

The application will be available at: `http://localhost:4000`

## 👤 Login Credentials

After running the seed script, you can login with these accounts:

**Admin Account:**
- Email: `admin@example.com`
- Password: `Admin@123`

**Regular Users:**
- Email: `john@example.com` / Password: `password123`
- Email: `sarah@example.com` / Password: `password123`

## 🌍 Location-Based Features

The application uses geolocation to show nearby listings and services:

1. **Allow Location Access**: When prompted, allow the browser to access your location
2. **Search Radius**: Adjust the search radius (5km, 10km, 25km, 50km)
3. **Sample Data**: All seeded users are located in major Indian cities for testing

## 🚀 Deployment

### Quick Deploy to Heroku

1. **Setup Heroku**
   ```bash
   npm install -g heroku
   heroku login
   heroku create your-app-name
   ```

2. **Configure Environment Variables**
   ```bash
   heroku config:set MONGO_URI="your-mongodb-connection-string"
   heroku config:set JWT_SECRET="your-jwt-secret"
   heroku config:set NODE_ENV=production
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

4. **Seed Production Database**
   ```bash
   heroku run npm run seed
   ```

### Other Deployment Options

- **Railway**: Connect GitHub repo for auto-deployment
- **DigitalOcean App Platform**: Connect repo with auto-SSL
- **VPS**: Use PM2 with Nginx reverse proxy

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Listings
- `GET /api/listings` - Get nearby listings
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create new listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Services
- `GET /api/services` - Get nearby services
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Messages
- `GET /api/messages` - Get messages
- `GET /api/messages/conversations` - Get conversations list
- `POST /api/messages` - Send message

### Reviews
- `GET /api/reviews/:userId` - Get user reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Admin (Admin only)
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/listings` - Get all listings for moderation
- `PUT /api/admin/listings/:id/approve` - Approve listing
- `PUT /api/admin/listings/:id/reject` - Reject listing

## 📁 Project Structure

```
hyperlocal-marketplace/
├── package.json
├── server.js                 # Main server file
├── seed.js                   # Database seeding script
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── README.md
├── models/                  # MongoDB models
│   ├── User.js
│   ├── Listing.js
│   ├── Service.js
│   ├── Request.js
│   ├── Message.js
│   ├── Review.js
│   ├── Cart.js
│   └── Order.js
├── routes/                  # API routes
│   ├── auth.js
│   ├── listings.js
│   ├── services.js
│   ├── requests.js
│   ├── messages.js
│   ├── reviews.js
│   ├── cart.js
│   ├── orders.js
│   └── admin.js
├── controllers/             # Route controllers
│   └── authController.js
├── middleware/              # Custom middleware
│   ├── auth.js
│   └── upload.js
├── uploads/                 # Uploaded images storage
│   └── .gitkeep
└── public/                  # Frontend files
    ├── index.html           # Home page
    ├── login.html           # Login page
    ├── register.html        # Registration page
    ├── create-listing.html  # Create listing page
    ├── listing.html         # Listing details page
    ├── cart.html            # Shopping cart page
    ├── checkout.html        # Checkout page
    ├── order-confirmation.html # Order confirmation page
    ├── orders.html          # User orders page
    ├── chat.html            # Messaging page
    ├── admin.html           # Admin panel
    ├── css/
    │   └── styles.css       # Main stylesheet
    └── js/
        └── auth.js          # Authentication utilities
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Input validation and sanitization
- File upload restrictions (images only, size limits)
- Admin-only routes protection
- CORS enabled for cross-origin requests
- Secure environment variable handling

## 🎯 Usage Examples

### Creating a Listing
1. Login to your account
2. Click "Sell Item" in the navigation
3. Fill out the listing form
4. Click "Use My Location" to set your location
5. Upload up to 5 images
6. Submit the listing

### Finding Nearby Items
1. Go to the home page
2. Click "Use My Location" to enable location-based search
3. Adjust search radius and category filters
4. Browse the results

### Messaging
1. Click "Contact" on any listing
2. Start a conversation with the seller
3. Messages update in real-time

### Admin Functions
1. Login with admin credentials
2. Go to `/admin.html`
3. View platform statistics
4. Moderate listings and manage users

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Verify your MongoDB Atlas connection string
- Check if your IP address is whitelisted in MongoDB Atlas
- Ensure the database user has proper permissions

**Location Not Working:**
- Enable location services in your browser
- Use HTTPS in production (required for geolocation)
- Check browser console for geolocation errors

**Images Not Uploading:**
- Check file size (max 5MB per image)
- Ensure file format is supported (JPG, PNG, GIF, WebP)
- Verify the `uploads/` directory exists and is writable

**Port Already in Use:**
- Change the PORT in your `.env` file
- Kill any existing processes using port 4000

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with multi-column layouts
- **Tablet**: Adapted layouts with touch-friendly interfaces
- **Mobile**: Single-column layouts with hamburger navigation
- **Small Mobile**: Optimized for screens as small as 320px

## 🔔 Update Notifications

The application includes a smart notification system that:
- Monitors for new listings in the background
- Shows non-intrusive notifications for new content
- Allows users to quickly scroll to new updates
- Auto-dismisses after 10 seconds
- Provides manual refresh options

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

This is a learning project. Feel free to fork and modify for your own use!

## 📞 Support

For issues and questions, please create an issue in the GitHub repository.

---

**Happy coding! 🎉**