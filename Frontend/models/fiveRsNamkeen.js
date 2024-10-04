const mongoose = require('mongoose');

// Define the product schema
const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    weight: { type: Number },
    category: { type: String, required: true },  // Category field
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]  // Link to Review schema
});

// Export the product model
const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
