const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// JWT Secret
const JWT_SECRET = 'your-secret-key-change-in-production';

// Admin credentials (in production, use a database)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10) // Default: admin/admin123
};

// In-memory storage (in production, use a database)
let services = [
    {
        id: 1,
        name: 'Haircut & Styling',
        description: 'Professional haircut and styling with premium products',
        price: '$45',
        icon: 'fa-cut'
    },
    {
        id: 2,
        name: 'Facial Treatment',
        description: 'Deep cleansing and rejuvenating facial treatment',
        price: '$65',
        icon: 'fa-spa'
    },
    {
        id: 3,
        name: 'Makeup Application',
        description: 'Professional makeup for any occasion',
        price: '$75',
        icon: 'fa-paint-brush'
    },
    {
        id: 4,
        name: 'Manicure & Pedicure',
        description: 'Complete nail care and polish application',
        price: '$55',
        icon: 'fa-hand-sparkles'
    },
    {
        id: 5,
        name: 'Hair Coloring',
        description: 'Professional hair coloring and highlights',
        price: '$85',
        icon: 'fa-palette'
    },
    {
        id: 6,
        name: 'Waxing Services',
        description: 'Full body waxing and hair removal',
        price: '$40',
        icon: 'fa-fire'
    }
];

let contactInfo = {
    phone: '+1 (555) 123-4567',
    email: 'info@luxebeauty.com',
    address: '123 Beauty Street, Spa City, SC 12345'
};

let bookings = [];
let nextServiceId = 7;
let nextBookingId = 1;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
}

// Routes

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === ADMIN_CREDENTIALS.username && bcrypt.compareSync(password, ADMIN_CREDENTIALS.password)) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Verify admin token
app.get('/api/admin/verify', verifyToken, (req, res) => {
    res.json({ success: true, admin: req.admin });
});

// Get all services
app.get('/api/services', (req, res) => {
    res.json(services);
});

// Add new service
app.post('/api/services', verifyToken, (req, res) => {
    const { name, description, price, icon } = req.body;
    
    if (!name || !description || !price) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const newService = {
        id: nextServiceId++,
        name,
        description,
        price,
        icon: icon || 'fa-spa'
    };
    
    services.push(newService);
    res.json({ success: true, service: newService });
});

// Update service
app.put('/api/services/:id', verifyToken, (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description, price, icon } = req.body;
    
    const serviceIndex = services.findIndex(s => s.id === id);
    if (serviceIndex === -1) {
        return res.status(404).json({ success: false, message: 'Service not found' });
    }
    
    services[serviceIndex] = {
        ...services[serviceIndex],
        name: name || services[serviceIndex].name,
        description: description || services[serviceIndex].description,
        price: price || services[serviceIndex].price,
        icon: icon || services[serviceIndex].icon
    };
    
    res.json({ success: true, service: services[serviceIndex] });
});

// Delete service
app.delete('/api/services/:id', verifyToken, (req, res) => {
    const id = parseInt(req.params.id);
    const serviceIndex = services.findIndex(s => s.id === id);
    
    if (serviceIndex === -1) {
        return res.status(404).json({ success: false, message: 'Service not found' });
    }
    
    services.splice(serviceIndex, 1);
    res.json({ success: true, message: 'Service deleted successfully' });
});

// Get contact info
app.get('/api/contact', (req, res) => {
    res.json(contactInfo);
});

// Update contact info
app.put('/api/contact', verifyToken, (req, res) => {
    const { phone, email, address } = req.body;
    
    contactInfo = {
        phone: phone || contactInfo.phone,
        email: email || contactInfo.email,
        address: address || contactInfo.address
    };
    
    res.json({ success: true, contact: contactInfo });
});

// Create booking
app.post('/api/bookings', (req, res) => {
    const { name, email, phone, service, date, message } = req.body;
    
    if (!name || !email || !phone || !service || !date) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const booking = {
        id: nextBookingId++,
        name,
        email,
        phone,
        service,
        date,
        message: message || '',
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    bookings.push(booking);
    
    // In a real application, you would send an email or SMS here
    console.log('New booking:', booking);
    
    res.json({ 
        success: true, 
        message: 'Booking request received successfully',
        booking 
    });
});

// Get all bookings (admin only)
app.get('/api/bookings', verifyToken, (req, res) => {
    res.json(bookings);
});

// Update booking status (admin only)
app.put('/api/bookings/:id', verifyToken, (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    
    const bookingIndex = bookings.findIndex(b => b.id === id);
    if (bookingIndex === -1) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    bookings[bookingIndex].status = status;
    res.json({ success: true, booking: bookings[bookingIndex] });
});

// File upload endpoint
app.post('/api/upload', verifyToken, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl });
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Start server
app.listen(PORT, () => {
    console.log(`🌟 Beauty Parlour Website running on http://localhost:${PORT}`);
    console.log(`📱 Admin access: http://localhost:${PORT} (click Admin link, login with admin/admin123)`);
    console.log(`🔧 API endpoints available at http://localhost:${PORT}/api/`);
});
