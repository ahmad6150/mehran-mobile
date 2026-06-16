import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  getAllUsers,
  deleteUser,
  createAdmin,
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Auth routes placeholder' });
});

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/create-admin', createAdmin);

// Private routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);

export default router;