const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

const multer = require('multer');

// Configure multer to store uploaded files in the 'uploads' folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Save the file with a unique name
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create a new product
router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const { title, price, description, category } = req.body;
        const image = req.file.filename; // Get the uploaded file's name

        // Create a new product with the uploaded image
        const product = new Product({
            title,
            price,
            description,
            image,  // Save the image filename to the product
            category
        });

        await product.save();
        res.json({ message: 'Product created successfully!', product });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all products with category
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.json(products);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Render form to add a new product
router.get('/new', async (req, res) => {
    const categories = await Category.find();
    res.render('admin/layout', { page: 'productForm', categories });
});

module.exports = router;
