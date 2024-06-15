"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: parseInt(process.env.DB_PORT, 10),
    dialectOptions: {
        options: {
            encrypt: true, // Abilita la crittografia
            enableArithAbort: true,
        }
    }
});
// export const sequelize = new Sequelize("TicTacToe", "user", "user", {
//   host: "LAPTOP-4NH6KED8",
//   dialect: "mssql",
//   port: 1433,
// });
