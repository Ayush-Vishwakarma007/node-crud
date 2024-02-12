const loginService = require('../services/login');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginService.login(email, password);
        // Omit password from the user object before sending response
        delete user['dataValues'].password
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error("Error logging in: ", error);
        res.status(401).json({ error: 'Invalid credentials' });
    }
};
