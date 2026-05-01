import express from 'express';
import { getAllUsers, updateProfile, changePassword } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getAllUsers);
router.patch('/profile', protect, updateProfile);
router.patch('/change-password', protect, changePassword);

export default router;
