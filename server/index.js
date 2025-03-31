import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});