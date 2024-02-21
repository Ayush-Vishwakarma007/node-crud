const { Sequelize } = require('sequelize');
const YAML = require('yaml');
const fs = require('fs');

const environment = process.env.NODE_ENV || 'development';
const databaseConfig = YAML.parse(fs.readFileSync(`./ymls/${environment}.yml`, 'utf8'));
const sequelize = new Sequelize( databaseConfig[environment]['database'], databaseConfig[environment]['username'], databaseConfig[environment]['password'], {
  host: databaseConfig[environment]['host'],
  dialect: 'postgres'
});

module.exports = sequelize;
