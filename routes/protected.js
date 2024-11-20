const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
}

router.get('/dashboard', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.session.userId);
    res.render('dashboard', {
        username: user.username,
        email: user.email,
        mobileNumber: user.mobileNumber,
        occupation: user.occupation,
    });
});

router.get('/edit-profile', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.session.userId);
    res.render('edit-profile', {
        username: user.username,
        email: user.email,
        mobileNumber: user.mobileNumber,
        occupation: user.occupation,
    });
});

router.post('/edit-profile', isAuthenticated, async (req, res) => {
    const { username, email, mobileNumber, occupation} = req.body;

    try {
        const user = await User.findById(req.session.userId);
        user.username = username;
        user.email = email;
        user.mobileNumber = mobileNumber;
        user.occupation = occupation;

        await user.save();
        res.redirect('/protected/dashboard');
    } catch (error) {
        console.error(error);
        res.send('Error: Unable to update user details');
    }
});

module.exports = router;
