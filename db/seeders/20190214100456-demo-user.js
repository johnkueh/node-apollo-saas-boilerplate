('use strict');

const bcrypt = require('bcrypt');

const password = bcrypt.hashSync('zapcms', 10);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@demo.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          password
        },
        {
          firstName: 'Michele',
          lastName: 'Wong',
          email: 'michele@demo.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          password
        },
        {
          firstName: 'Jack',
          lastName: 'Peacock',
          email: 'jack@demo.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          password
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
