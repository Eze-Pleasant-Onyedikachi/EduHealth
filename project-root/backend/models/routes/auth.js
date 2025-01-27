const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../user.js');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
        await user.save();
        console.log(User)

        res.status(201).send("User registered");
    } catch (error) {
        res.status(400).send("Error registering user");
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        // const token = jwt.sign({ id: user._id }, 'secretKey');
        // res.json({ token });
        res.status(200).json({
            message: 'Login successful!',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                records: user.records || [],
            },
        });
    } else {
        res.status(401).send("Invalid credentials");
    }
});

module.exports = router;
