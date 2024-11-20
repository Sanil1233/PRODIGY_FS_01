const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { username, email, password, mobileNumber, occupation } = req.body;
    try {
        const user = new User({ username, email, password, mobileNumber, occupation });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.send('Error: Unable to register');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.render('login', { error: 'Invalid credentials' });
        }
        req.session.userId = user._id;
        res.redirect('/protected/dashboard');
    } catch (error) {
        console.error(error);
        res.send('Error: Unable to login');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;