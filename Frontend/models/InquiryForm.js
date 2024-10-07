const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
    orgName: String,
    contactNo: String,
    address: String,
    brand: String,
    contactPerson: String,
    gst: String,
    monthlyTurnover: Number,
    yearsInBusiness: Number
});

module.exports = mongoose.model('Inquiry', InquirySchema);
