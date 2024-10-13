// routes/auth.js
const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { sendEmail } = require('../email');


const router = express.Router();



router.get('/login', (req, res) => {
  res.render('admin/auth/login');
});

// Login route
router.post('/login', passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/login-failed',
  failureFlash: true
}));

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.send('Error logging out');
    }
    res.send('Logged out successfully');
  });
});




// ---------------------------forget and reset password------------------------     

//------fotget and reset pages for user --------------------
// Route to render forgot password page with flash messages
router.get('/forgot-password', (req, res) => {
    const successMessages = req.flash('success');
    const errorMessages = req.flash('error');
    res.render('admin/auth/forgotPassword', {
        title: 'Forgot Password',
        success: successMessages,
        error: errorMessages
    });
});
;
router.get('/reset-password/:token', (req, res) => {
    const successMessages = req.flash('success');
    const errorMessages = req.flash('error');
    res.render('admin/auth/resetPassword', { title: 'Reset Password' ,success: successMessages,
        error: errorMessages, token: req.params.token })});





// Route to handle forgot password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        // Logic to check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'No account with that email found.');
            return res.redirect('/forgot-password');
        }
        console.log(process.env.SMTP_HOST)
        
        // console.log(user);
        // Send reset email
        const resetLink = `http://localhost:3000/reset-password/${user._id}`; // Generate a reset link
        const subject = 'Password Reset Request';
        const text = `You requested a password reset. Click the link to reset: ${resetLink}`;
        const html = `<p>You requested a password reset. Click the link to reset:</p><a href="${resetLink}">${resetLink}</a>`;

        await sendEmail(email, subject, text, html); // Send email to the user

        req.flash('success', 'Password reset email sent!');
        res.redirect('/forgot-password');
    } catch (err) {
        req.flash('error', 'An error occurred while sending the email.');
        res.redirect('/forgot-password');
    }
});

// Route to reset password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.token,
        });

        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot-password');
        }

        if (req.body.password === req.body.confirm) {
            user.password = await req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            req.flash('success', 'Password has been updated successfully.');
            res.redirect('/login');
        } else {
            req.flash('error', 'Passwords do not match.');
            res.redirect(`/reset-password/${req.params.token}`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error on reset password route');
    }
});

module.exports = router;
