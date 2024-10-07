const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Display all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.render('admin/layout', {page:'category/categoryList', categories });
    } catch (err) {
        res.status(500).send("Error retrieving categories");
    }
});

// Display form to create a new category
router.get('/new', (req, res) => {
    res.render('admin/layout', {page:'category/categoryForm'});
});

// Create a new category
router.post('/create', async (req, res) => {
    const { name } = req.body;
    try {
        const category = new Category({ name });
        await category.save();
        res.redirect('/categories');
    } catch (err) {
        res.status(500).send("Error creating category");
    }
});

// Display form to edit a category
router.get('/update/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        console.log("category",category.name);
        res.render('admin/layout', { page: 'category/categoryEdit', category}); // Ensure 'category' is passed as a variable
    } catch (err) {
        res.status(500).send("Error retrieving category");
    }
});


// Update a category
router.post('/update/:id', async (req, res) => {
    const { name } = req.body;
    try {
        await Category.findByIdAndUpdate(req.params.id, { name });
        res.redirect('/categories');
    } catch (err) {
        res.status(500).send("Error updating category");
    }
});

// Delete a category
router.post('/delete/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.redirect('/categories');
    } catch (err) {
        res.status(500).send("Error deleting category");
    }
});

module.exports = router;
