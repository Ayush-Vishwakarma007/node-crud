'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('ADMIN', 'CUSTOMER', 'CLIENT'),
      defaultValue: 'CLIENT'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'role');
  }
};
