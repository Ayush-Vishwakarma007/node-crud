'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'skills', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'location', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'appointedBy', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'skills');
    await queryInterface.removeColumn('users', 'phone');
    await queryInterface.removeColumn('users', 'location');
    await queryInterface.removeColumn('users', 'appointedBy');
  }
};
