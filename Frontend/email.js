// email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
});



// Function to send emails
const sendEmail = (to, subject, text, html) => {
    const mailOptions = {
        from: 'test@test.com', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html // html body
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
