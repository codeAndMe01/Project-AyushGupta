// models/Namkeen.js
const mongoose = require('mongoose');

// Define the Namkeen schema
const fiveRsNamkeenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,  // Save the image file name or path
        required: true
    },
    price: {
        type: String,
        required: true
    }
});

// Create and export the Namkeen model
module.exports = mongoose.model('fiveRsNamkeenSchema', fiveRsNamkeenSchema);
