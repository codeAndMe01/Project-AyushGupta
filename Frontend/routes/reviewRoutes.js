// routes/review.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Add a review to a product
router.post('/create', async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.json(review);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get reviews for a product
router.get('/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId });
        res.json(reviews);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;