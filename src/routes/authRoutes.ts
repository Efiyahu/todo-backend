import express from 'express';
const router = express.Router();

import {
  register,
  login,
  uploadAvatar,
  getUserImage,
} from '../controllers/authController';
import upload from '../middleware/uploadImage';

router.get('/user-image/:id', getUserImage);
router.post('/register', register);
router.post('/login', login);
router.patch('/upload/:id', upload.single('myFile'), uploadAvatar);

export default router;
