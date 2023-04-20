import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT;
const mongoUrl = process.env.MONGO_URL as string;

import todoRoutes from './routes/todoRoutes';
import authRoutes from './routes/authRoutes';

import errorHandlerMiddleWare from './middleware/error-handler';

app.use('/api/v1/todos', todoRoutes);
app.use('/api/v1/auth', authRoutes);

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
