import express from 'express';

import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  createProductReview,
  getAdminProducts,
} from '../controllers/productController.js';
import protect from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);

// Admin routes
router.get('/admin/all', protect, admin, getAdminProducts);
router.post('/', protect, admin, upload.array('images', 5), createProduct);
router.put('/:id', protect, admin, upload.array('images', 5), updateProduct);
router.delete('/:id/images/:public_id', protect, admin, deleteProductImage);
router.delete('/:id', protect, admin, deleteProduct);

// Public/private detail routes
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, createProductReview);

export default router;