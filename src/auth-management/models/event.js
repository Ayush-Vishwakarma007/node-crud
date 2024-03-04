// models/event.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Event = sequelize.define('event', {
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    event_date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    event_location: {
        type: DataTypes.STRING,
        allowNull: false    
    },
    event_time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    organiser_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    project_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    appliedBy: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [] 
    }
});

module.exports = Event;
