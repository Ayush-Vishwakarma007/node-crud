exports.validateSignup = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Add more validation rules as needed

    next();
};
