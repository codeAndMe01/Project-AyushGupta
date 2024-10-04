// routes/category.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Create a new category
router.get('/create', async (req, res) => {
    try {
        const category = new Category({
            name: 'Namkeen'
        });
        await category.save();
        res.json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});




module.exports = router;
