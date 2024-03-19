'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Modify the enum type to change values
    await queryInterface.sequelize.query('ALTER TYPE "enum_users_role" ADD VALUE \'COMPANY\';');
    await queryInterface.sequelize.query('ALTER TYPE "enum_users_role" ADD VALUE \'VOLUNTEER\';');

    // Update existing rows to reflect the new enum values
    await queryInterface.sequelize.query('UPDATE "users" SET "role" = \'COMPANY\' WHERE "role" = \'CUSTOMER\';');
    await queryInterface.sequelize.query('UPDATE "users" SET "role" = \'VOLUNTEER\' WHERE "role" = \'CLIENT\';');
  },

  async down(queryInterface, Sequelize) {
    // Revert the enum values back to their original values
    await queryInterface.sequelize.query('UPDATE "users" SET "role" = \'CUSTOMER\' WHERE "role" = \'COMPANY\';');
    await queryInterface.sequelize.query('UPDATE "users" SET "role" = \'CLIENT\' WHERE "role" = \'VOLUNTEER\';');

    // Remove the newly added enum values
    await queryInterface.sequelize.query('ALTER TYPE "enum_users_role" DROP VALUE \'COMPANY\';');
    await queryInterface.sequelize.query('ALTER TYPE "enum_users_role" DROP VALUE \'VOLUNTEER\';');
  }
};
