const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

// Set up transporter
let transporter = nodemailer.createTransport({
    host: "smtp.example.com", // Replace with your mail server host
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'yourEmail@example.com', // your SMTP username
        pass: 'yourEmailPassword', // your SMTP password
    },
});

// Mail sending controller
router.post('/send-email', (req, res) => {
    const { name, email, message, company } = req.body;

    // Prepare email to send to yourself
    let mailOptionsToYou = {
        from: {email}, // Sender address
        to: 'myEmailAddress.com', // Your own email to receive the form submission
        subject: 'Contact Form Submission', // Subject line
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nCompany: ${company}`, // Body
    };

    // Send email to yourself
    transporter.sendMail(mailOptionsToYou, function(error, info){
        if (error) {
            console.log(error);
            res.status(500).json({msg: 'Failed to send email to admin', error: error.toString()});
        } else {
            console.log('Email sent to admin: ' + info.response);

            // Prepare confirmation email to user
            let mailOptionsToUser = {
                from: 'yourEmail@example.com', // Sender address
                to: email, // User's email from the form
                subject: 'Your Submission Was Received', // Subject line
                text: `Hi ${name},\n\nThank you for contacting me. This is just to confirm I have received your message and will get back to you as soon as possible.\n\nBest,\nLewie Marks`, // Body
            };

            // Send confirmation email to user
            transporter.sendMail(mailOptionsToUser, function(error, info){
                if (error) {
                    console.log('Confirmation email to user failed: ', error);
                    // Don't fail the entire request because of this
                } else {
                    console.log('Confirmation email sent to user: ' + info.response);
                }
                // Respond after attempting to send both emails
                res.status(200).json({msg: 'Email sent to admin and confirmation email attempted to user'});
            });
        }
    });
});

module.exports = router;
