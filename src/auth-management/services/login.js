const fs = require('fs');
const YAML = require('yaml');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const environment = process.env.NODE_ENV || 'development';
const config = YAML.parse(fs.readFileSync(`./ymls/${environment}.yml`, 'utf8'));

exports.login = async (email, password) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            config.jwt_secret_key,
            { expiresIn: '24h' }
        );
        delete user.dataValues['password']
        const data_return = {
            user: user.dataValues,
            token: token
        }
        return data_return;
    } catch (error) {
        throw error;
    }
};


