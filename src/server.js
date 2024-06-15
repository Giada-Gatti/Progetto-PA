"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./database/database");
// import { authMiddleware, adminMiddleware } from './middleware/authMiddleware';
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
// Database connection
database_1.sequelize.sync().then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.error('Database connection error:', err);
});
// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Tic Tac Toe API');
});
// Middleware
// app.use(authMiddleware);
// User routes
app.post('/register', async (req, res) => {
    // Registration logic
});
app.post('/login', async (req, res) => {
    // Login logic
});
// Match routes
app.post('/matches', async (req, res) => {
    // Create match logic
});
app.post('/matches/:id/move', async (req, res) => {
    // Make move logic
});
app.get('/matches/:id', async (req, res) => {
    // Get match status logic
});
app.delete('/matches/:id', async (req, res) => {
    // Abandon match logic
});
// Admin routes
// app.post('/admin/credit', [authMiddleware, adminMiddleware], async (req, res) => {
//   // Admin credit recharge logic
// });
// app.get('/profile/credit', authMiddleware, async (req, res) => {
//   // Get user credit logic
// });
// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
