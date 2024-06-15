import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { sequelize } from './database/database';
// import { authMiddleware, adminMiddleware } from './middleware/authMiddleware';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Database connection
sequelize.sync().then(() => {
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
