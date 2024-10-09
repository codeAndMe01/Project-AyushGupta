const mongoose = require('mongoose');


const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    fax: String,
    city: String,
    state: String,
    address: String,
    comment: String
  });
  
  // Create Model
  module.exports  = mongoose.model('Feedback', feedbackSchema);
