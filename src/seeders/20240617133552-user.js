'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up:  (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'user1@example.com',
        password:  bcrypt.hashSync('password123', 10),
        credit: 10,
        role: 'user',
      },
      {
        email: 'user2@example.com',
        password: bcrypt.hashSync('password124', 10),
        credit: 20,
        role: 'admin',
      },
      {
        email: 'user3@example.com',
        password: bcrypt.hashSync('password125', 10),
        credit: 8,
        role: 'user',
      },
      {
        email: 'user4@example.com',
        password: bcrypt.hashSync('password126', 10),
        credit: 5,
        role: 'user',
      },
      {
        email: 'ai@ai.com',
        password: bcrypt.hashSync('passwordAI', 10),
        credit: 10,
        role: 'ai',
      },
    ]);
  },
  

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
