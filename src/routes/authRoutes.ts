import express from 'express';
const router = express.Router();

import { register, login } from '../controllers/authController';

router.post('/register', register);

export default router;
