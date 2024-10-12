const express = require('express');
const app = express();
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');


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
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/reviews', reviewRoutes);
app.use('/inquiry', inquiryRoutes);
app.use('/feedback', feedbackRoutes);

// Home Route
app.get('/', async (req, res) => {
    try {
        const namkeenFilePath = path.join(__dirname, 'public', 'data', 'fiveRsNamkeen.json');
        const fiveRsPuffsPath = path.join(__dirname, 'public', 'data', 'fiveRsPuffs.json');

        // Read both JSON files concurrently
        const [namkeenData, fiveRsPuffsData] = await Promise.all([
            readJsonFile(namkeenFilePath),
            readJsonFile(fiveRsPuffsPath)
        ]);

        res.render('index', { title: 'Home', namkeenData, fiveRsPuffsData });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// About and Contact Pages
app.get('/about', (req, res) => res.render('index', { title: 'About' }));
app.get('/contact', (req, res) => res.render('index', { title: 'Contact' }));

// Admin Routes
app.get('/admin', (req, res) => res.render('admin/layout', { page: 'dashboard' }));
app.get('/admin/productsList', (req, res) => res.render('admin/layout', { page: 'productsList' }));

// Category Page
app.get('/fivers-namkeen', (req, res) => res.render('categories/NamkeenFive', { title: 'Category' }));

// Inquiry and Feedback Forms
app.get('/inquiry-form', (req, res) => res.render('forms/inquiryForm', { title: 'Inquiry Form' }));
app.get('/feedback-form', (req, res) => res.render('forms/feedbackForm', { title: 'Feedback Form' }));

// First Product Page
app.get('/first-product', (req, res) => res.render('productPages/firstProduct', { title: 'First Product' }));




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
