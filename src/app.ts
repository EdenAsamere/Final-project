import dotenv from 'dotenv';  // Import dotenv
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import express from 'express';
import { connectDB } from './config/db';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

export default app;
