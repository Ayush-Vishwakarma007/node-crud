require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const YAML = require('yaml');
const fs = require('fs');
const { Sequelize } = require('sequelize');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const databaseConfig = YAML.parse(fs.readFileSync(`./ymls/${environment}.yml`, 'utf8'));
const sequelize = new Sequelize( databaseConfig[environment]['database'], databaseConfig[environment]['username'], databaseConfig[environment]['password'], {
    host: databaseConfig[environment]['host'],
    dialect: 'postgres'
});

app.use(bodyParser.json());
const signupRouter = require('./src/auth-management/routes/signup');
app.use('/auth/signup', signupRouter);


sequelize.sync().then(() => {
    app.listen(databaseConfig[environment]['port'], () => {
        console.log(`Server is running on port ${databaseConfig[environment]['port']}`);
    });
}).catch(err => {
    console.error('Error syncing database:', err);
});
