const express = require('express');
const router = express.Router();
const Inquiry = require('../../models/InquiryForm');

// Route to render the form
router.get('/form', (req, res) => {
    res.render('form'); // Render the inquiry form page
});

// Route to handle form submissions

// Route to display all inquiries
router.get('/', async (req, res) => {
    try {
        const inquiries = await Inquiry.find({});
        res.render('admin/layout', {page:'forms/inquiryList' , inquiries}); // Pass inquiries data to the view
    } catch (err) {
        res.status(500).send('Error retrieving the inquiry data.');
    }
});

module.exports = router;
