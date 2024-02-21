const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const User = sequelize.define('user', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('ADMIN', 'CUSTOMER', 'CLIENT'), 
        defaultValue: 'CLIENT'
    }
});

module.exports = User;
