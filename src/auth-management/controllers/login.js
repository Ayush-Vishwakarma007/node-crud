const { response } = require('express');
const loginService = require('../services/login');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginService.login(email, password); 
        res.send(user, 200, 'Login Successful', 'Success');
    } catch (error) {
        if (error.message === 'Invalid password') {
            res.send(null, 401, 'Invalid email or password', 'BAD_RQUEST');
        } else {
            res.send(null, 500, 'Internal server error', 'Error');
        }
    }
};
