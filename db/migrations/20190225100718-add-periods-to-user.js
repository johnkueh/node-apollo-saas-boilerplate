'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn('users', 'periodStart', Sequelize.DATE),
      await queryInterface.addColumn('users', 'periodEnd', Sequelize.DATE)
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('users', 'periodStart'),
      await queryInterface.removeColumn('users', 'periodEnd')
    ];
  }
};
