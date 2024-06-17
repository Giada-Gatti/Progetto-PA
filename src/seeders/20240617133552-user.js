'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up:  (queryInterface, Sequelize) => {
    //const hashedPassword = bcrypt.hashSync('password123', 10);
    return queryInterface.bulkInsert('Users', [
      {
        email: 'user1@example.com',
        password:  bcrypt.hashSync('password123', 10),
        credit: 10,
      },
      {
        email: 'user2@example.com',
        password: bcrypt.hashSync('password1234', 10),
        credit: 20,
      },
      {
        email: 'user3@example.com',
        password: bcrypt.hashSync('password1235', 10),
        credit: 8,
      },
      {
        email: 'user4@example.com',
        password: bcrypt.hashSync('password1236', 10),
        credit: 5,
      },
    ]);
  },
  

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
