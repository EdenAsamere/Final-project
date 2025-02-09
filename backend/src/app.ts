import dotenv from 'dotenv';  // Import dotenv
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import express from 'express';
import { connectDB } from './config/db';
import userRoutes from './routes/user.routes';
import equbGroupRoutes from './routes/equbgroup.routes'; // Correct route import
import profileRoutes from './routes/profile.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/equb', equbGroupRoutes); 
app.use('/api/profile', profileRoutes);

connectDB();

export default app;
