'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Creazione della tabella Users
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      credit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      matchId: {
        type: Sequelize.INTEGER,
      },
      matchesWon: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      matchesLost: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      matchesWonByAbandon: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      matchesLostByAbandon: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      matchesWonVsAI: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      matchesLostVsAI: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Creazione della tabella Matches
    await queryInterface.createTable('Matches', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      isAgainstAI: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      currentPlayerId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      player1Id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      player2Id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      winnerId: {
        type: Sequelize.INTEGER
      },
      maxMoveTime: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      board: {
        type: Sequelize.STRING,
        defaultValue: '---------',
        validate: {
          len: [9, 9],
        },
      },
      lastMoveAt:{
        type: Sequelize.DATE
      }
    });

    // Creazione della tabella Moves
    await queryInterface.createTable('Moves', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      playerId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      matchId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      symbol: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminazione della tabella Moves
    await queryInterface.dropTable('Moves');
    
    // Eliminazione della tabella Matches
    await queryInterface.dropTable('Matches');
    
    // Eliminazione della tabella Users
    await queryInterface.dropTable('Users');
  }
};
