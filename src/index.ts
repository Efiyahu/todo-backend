import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import 'express-async-errors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
import auth from './middleware/auth';

import cors from 'cors';
app.use(cors());

const PORT = process.env.PORT;
const mongoUrl = process.env.MONGO_URL as string;

import todoRoutes from './routes/todoRoutes';
import authRoutes from './routes/authRoutes';

import errorHandlerMiddleWare from './middleware/error-handler';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/todos', auth, todoRoutes);

app.use(errorHandlerMiddleWare);

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log('mongodb connected...');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

app.listen(PORT, () => {
  connectDB();
  console.log(`App is running on port ${PORT}....`);
});
