"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Move = exports.Symbol = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database/database");
var Symbol;
(function (Symbol) {
    Symbol["X"] = "X";
    Symbol["O"] = "O";
})(Symbol || (exports.Symbol = Symbol = {}));
class Move extends sequelize_1.Model {
}
exports.Move = Move;
Move.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    playerId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    matchId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    position: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    symbol: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'Move',
});
