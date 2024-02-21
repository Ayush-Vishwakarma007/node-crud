const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.createUser = async (name, email, password, role) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword,role});
};
