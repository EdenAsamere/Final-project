// app.js (or index.js)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { connectDB } from './config/db'; // Ensure your db connection is correct
import userRoutes from './routes/user.routes';
import equbGroupRoutes from './routes/equbgroup.routes'; // Correct route import

dotenv.config(); // Load environment variables from .env file

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.use('/api/users', userRoutes);
app.use('/api/equb', equbGroupRoutes); // Ensure this is properly mounted

// Connect to the database
connectDB();

export default app; // Export the app instance
