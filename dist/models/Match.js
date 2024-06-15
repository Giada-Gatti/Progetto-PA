"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database/database");
class Match extends sequelize_1.Model {
}
exports.Match = Match;
Match.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    currentPlayerId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    opponentPlayerId: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    winnerId: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    maxTime: {
        type: sequelize_1.DataTypes.INTEGER,
    }
}, {
    sequelize: database_1.sequelize,
    modelName: 'Match',
});
