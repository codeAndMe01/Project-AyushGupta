const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category'); // Import the Category model if you have it

router.get('/search', async (req, res) => {
    const { query } = req.query; // Get the search query from request

    console.log(query);

    try {
        // Find categories that match the query
        const categories = await Category.find({
            name: { $regex: query, $options: 'i' } // Search category by name
        });

        // If categories are found, get their IDs
        const categoryIds = categories.map(category => category._id);

        // Find products that match the title or belong to the found categories
        const products = await Product.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Case-insensitive title match
                { category: { $in: categoryIds } } // Match category IDs
            ]
        }).populate('category'); // Populate category details for products

        res.render('search/searchPage', {products , query,  title: 'search' } );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error while searching products' });
    }
});


module.exports = router;