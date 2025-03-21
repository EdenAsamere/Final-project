import dotenv from 'dotenv';  // Import dotenv
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import express from 'express';
import { connectDB } from './config/db';
import userRoutes from './routes/user.routes';
import equbGroupRoutes from './routes/equbgroup.routes'; 
import profileRoutes from './routes/profile.routes';
import idVerificationRoutes from './routes/idVerification.route'
import paymentRoutes from './routes/payment.routes';
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/equb', equbGroupRoutes); 
app.use('/api/profile', profileRoutes);
app.use('/api/idVerification', idVerificationRoutes)
app.use('/api/payments', paymentRoutes);
connectDB();

export default app;
