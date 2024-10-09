const express = require('express');
const router = express.Router();
const Feedback = require('../../models/Feedback');


// Route to handle form submissions
router.post('/create', (req, res) => {
    const newFeedback = new Feedback(req.body);
    newFeedback.save();
    res.send('ok');
  });

// Route to display all inquiries
router.get('/', async (req, res) => {
    try {
        const feedback = await Feedback.find({});
        res.render('admin/layout', {page:'forms/feedbackList' , feedback}); // Pass inquiries data to the view
    } catch (err) {
        res.status(500).send('Error retrieving the inquiry data.');
    }
});

module.exports = router;
