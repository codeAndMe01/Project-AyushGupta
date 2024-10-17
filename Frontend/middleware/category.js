// middleware/categoryMiddleware.js
const Category = require('../models/Category');

const fetchCategories = async (req, res, next) => {
  try {
    // Fetch all categories from the database
    const categories = await Category.find({});
    
    // Pass the categories to every view through res.locals
    res.locals.categories = categories;
    
    // Move to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send('Server Error');
  }
};

module.exports = fetchCategories;
