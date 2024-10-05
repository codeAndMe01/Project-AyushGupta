const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const multer = require('multer');
const path = require('path');

// Configure multer to store uploaded files in the 'uploads' folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Save the file with a unique name and its original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create a new product
router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const { title, price, description, category } = req.body;
        const image = req.file.filename; // Access the uploaded image filename
            
        // Create and save a new product with the uploaded image
        const product = new Product({
            title,
            price,
            description,
            image,  // Storing the image filename in the DB
            category
        });

        await product.save(); // Insert product into the database
        res.redirect('/products');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all products with their categories populated
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('category'); // Populate category details
        res.render('admin/layout', { page: 'productsList', products });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Render form to add a new product
router.get('/new', async (req, res) => {
    const categories = await Category.find();
    res.render('admin/layout', { page: 'productForm', categories });
});

// Edit form route (GET request)
router.get('/update/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        const categories = await Category.find(); // Fetch categories for the dropdown
        res.render('admin/layout', { page: 'editProduct',  product, categories }); // Render edit form
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update product route (POST request)
router.post('/edit/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, price, description, category } = req.body;
        const product = await Product.findById(req.params.id);

        // Check if a new image was uploaded
        if (req.file) {
            product.image = req.file.filename; // Replace the old image with the new one
        }

        // Update other fields
        product.title = title;
        product.price = price;
        product.description = description;
        product.category = category;

        await product.save(); // Save the updated product
        res.redirect('/products'); // Redirect to the product list after editing
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// Delete product route
router.post('/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id); // Delete the product by its ID
        res.redirect('/products'); // Redirect back to the product list after deletion
    } catch (err) {
        res.status(500).send('Server Error');
    }
});



module.exports = router;
