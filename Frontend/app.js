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
const ensureAuthenticated = require('./middleware/auth'); // Import the middleware
const fetchCategories = require('./middleware/category'); // Import the category middleware
const Inquiry = require('./models/InquiryForm');
const Feedback = require('./models/Feedback')



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

// middleware for passing categories in every route 
app.use(fetchCategories);

// Routes
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const  inquiryRoutes = require('./routes/formRoutes/inquiryForm');
const feedbackRoutes =  require('./routes/formRoutes/feedbackForm')
const searchRoutes =  require('./routes/searchRoutes')
app.use('/categories', ensureAuthenticated,categoryRoutes);
app.use('/products', ensureAuthenticated,productRoutes);
app.use('/reviews', reviewRoutes);
app.use('/inquiry',ensureAuthenticated, inquiryRoutes);
app.use('/feedback',feedbackRoutes);
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
        res.render('index', { title: 'Home', productsByCategory , categories });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// About and Contact Pages
app.get('/about-us', (req, res) => res.render('aboutUs', { title: 'About-Us' }));
app.get('/contact-us', (req, res) => res.render('contactUs', { title: 'Contact-Us' }));

app.get('/search-us', (req, res) => res.render('search/searchPage', { title: 'search' }));

// Admin Routes
app.get('/admin',ensureAuthenticated, (req, res) => res.render('admin/layout', { page: 'dashboard' }));
app.get('/admin/productsList', (req, res) => res.render('admin/layout', { page: 'productsList' }));

// particular Category Page route ----------------------------------------------------------------
app.get('/category/:categoryName', async (req, res) => {
    try {
        const categoryName = req.params.categoryName; // Get the category name from the URL
        // Find the category by name
        const category = await Category.findOne({ name: categoryName });
        const categories = await Category.find({});
        
        if (!category) {
            return res.status(404).send('Category not found');
        }
        
        // Fetch products that belong to the found category
        const products = await Product.find({ category: category._id });
        // console.log(products.map(product => product.image));

        
        // Render the view and pass the products to the template
        res.render('categories/namkeenfive', { 
            title: `Category: ${categoryName}`, 
            products ,
            categories
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


// Inquiry and Feedback Forms
app.get('/inquiry-form', (req, res) => res.render('forms/inquiryForm', { title: 'Inquiry Form', successMessage: req.flash('success_msg'), // Correctly passing success message
    errorMessage: req.flash('error_msg') }));


app.post('/inquiry-form/create', (req, res) => {
    const newFeedback = new Feedback(req.body);
    
    newFeedback.save()
        .then(() => {
            // Set flash message for success
            req.flash('success_msg', 'Inquiry submitted successfully!');
            res.redirect('/inquiry-form'); // Redirect without additional data
        })
        .catch(err => {
            console.error(err);
            // Set flash message for error
            req.flash('error_msg', 'Feedback submission failed. Please try again.');
            res.redirect('/inquiry-form'); // Redirect without additional data
        });
});

    
    

app.get('/feedback-form', (req, res) => res.render('forms/feedbackForm', { successMessage: req.flash('success_msg'), // Pass success message
    errorMessage: req.flash('error_msg'), // Pass error message
    title: 'Feedback'  }));
// Route for specific product pages
app.get('/product/:productId', async (req, res) => {
    try {
        const productId = req.params.productId; // Get product ID from the URL
        const product = await Product.findById(productId); // Fetch product by ID

        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Fetch related products (example: based on category or some other logic)
        const relatedProducts = await Product.find({ 
            category: product.category, 
            _id: { $ne: productId } // Exclude the current product
        }).limit(5); // Limit the number of related products

        // Render the product page with dynamic data
        res.render('productPages/productDetail', { 
            title: 'Product Details',
            product, 
            relatedProducts 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
