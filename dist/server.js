"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
debugger;
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
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Registration logic
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Login logic
}));
// Match routes
app.post('/matches', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Create match logic
}));
app.post('/matches/:id/move', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Make move logic
}));
app.get('/matches/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get match status logic
}));
app.delete('/matches/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Abandon match logic
}));
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
