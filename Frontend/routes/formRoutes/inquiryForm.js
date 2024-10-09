const express = require('express');
const router = express.Router();
const Inquiry = require('../../models/InquiryForm');

// Route to render the form
router.get('/form', (req, res) => {
    res.render('form'); // Render the inquiry form page
});

// Route to handle form submissions
router.post('/create', async (req, res) => {
    console.log(req.body)
    try {
        
        const newInquiry = new Inquiry(req.body);
        await newInquiry.save();
        res.send("Thanks for submitting")
        // res.redirect('/thankyouPage'); // Redirect to the page displaying all inquiries
    } catch (err) {
        res.status(500).send('Error saving the inquiry data.');
    }
});

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
