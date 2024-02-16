const User = require('../models/user');
const signupService = require('../services/signup');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        await signupService.createUser(name, email, password);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error("Error creating user: ", error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
