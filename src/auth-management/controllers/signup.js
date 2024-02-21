const User = require('../models/user');
const signupService = require('../services/signup');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log("Credentials__: ", email, password)

        await signupService.createUser(name, email, password, role.toUpperCase());
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error("Error creating user: ", error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
