const express = require('express');
const app = express();
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const Product = require('./models/Product');
const Category = require('./models/Category');
const passport = require('passport');
const flash = require('connect-flash');
const ensureAuthenticated = require('../Frontend/middleware/auth'); // Import the middleware



require('dotenv').config();

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// DB Connection
const connectDB = require('./db');
connectDB();  // Connect to MongoDB



// Middleware
app.use(bodyParser.json());  // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies



// Serve static files from "public" and "uploads" folders
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));


// -----User login ----------------------------------------------------
// Session middleware
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
  }));
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  
  // Passport config
  require('./config/passport')(passport);
  
  // Routes
  app.use(require('./routes/auth'));
  app.use(require('./routes/protected'));


// -----User login ----------------------------------------------------


// Function to read JSON files
const readJsonFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new Error(`Error reading ${filePath}: ${err.message}`);
    }
};

// Routes
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const  inquiryRoutes = require('./routes/formRoutes/inquiryForm');
const feedbackRoutes =  require('./routes/formRoutes/feedbackForm')
const searchRoutes =  require('./routes/searchRoutes')
app.use('/categories', ensureAuthenticated,categoryRoutes);
app.use('/products', ensureAuthenticated,productRoutes);
app.use('/reviews',ensureAuthenticated, reviewRoutes);
app.use('/inquiry',ensureAuthenticated, inquiryRoutes);
app.use('/feedback', ensureAuthenticated,feedbackRoutes);
app.use( searchRoutes);

// Home Route
app.get('/', async (req, res) => {
    try {
        // Fetch categories and products from the database
        const categories = await Category.find({});
        const productsByCategory = await Promise.all(
            categories.map(async (category) => {
                const products = await Product.find({ category: category._id }).populate('category');
                return { category: category.name, products };
            })
        );

        // Render the products by category in the template
        res.render('index', { title: 'Home', productsByCategory });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// About and Contact Pages
app.get('/about-us', (req, res) => res.render('aboutUs', { title: 'About-Us' }));
app.get('/contact-us', (req, res) => res.render('contactUs', { title: 'Contact-Us' }));

// Admin Routes
app.get('/admin',ensureAuthenticated, (req, res) => res.render('admin/layout', { page: 'dashboard' }));
app.get('/admin/productsList', (req, res) => res.render('admin/layout', { page: 'productsList' }));

// Category Page
app.get('/fivers-namkeen', (req, res) => res.render('categories/namkeenfive', { title: 'Category' }));

// Inquiry and Feedback Forms
app.get('/inquiry-form', (req, res) => res.render('forms/inquiryForm', { title: 'Inquiry Form' }));
app.get('/feedback-form', (req, res) => res.render('forms/feedbackForm', { title: 'Feedback Form' }));

// First Product Page
app.get('/first-product', (req, res) => res.render('productPages/firstProduct', { title: 'First Product' }));




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
