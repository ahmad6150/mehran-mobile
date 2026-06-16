import asyncHandler from 'express-async-handler';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import Product from '../models/Product.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to Cloudinary helper
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'mehran-mobile/products',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// @desc    Get all products with filters, search, pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  const {
    keyword,
    category,
    brand,
    minPrice,
    maxPrice,
    rating,
    sort,
    featured,
  } = req.query;

  // Build filter object
  const filter = { isActive: true };

  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { brand: { $regex: keyword, $options: 'i' } },
    ];
  }

  if (category) filter.category = category;
  if (brand) filter.brand = { $regex: brand, $options: 'i' };
  if (featured) filter.featured = featured === 'true';

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (rating) {
    filter.ratings = { $gte: Number(rating) };
  }

  // Build sort object
  let sortObj = { createdAt: -1 };
  if (sort === 'price-asc') sortObj = { price: 1 };
  if (sort === 'price-desc') sortObj = { price: -1 };
  if (sort === 'rating') sortObj = { ratings: -1 };
  if (sort === 'newest') sortObj = { createdAt: -1 };
  if (sort === 'oldest') sortObj = { createdAt: 1 };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortObj)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
    hasMore: page < Math.ceil(count / pageSize),
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    success: true,
    product,
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(8);

  res.json({
    success: true,
    products,
  });
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.page) || 1;

  const count = await Product.countDocuments({
    category: req.params.category,
    isActive: true,
  });

  const products = await Product.find({
    category: req.params.category,
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    originalPrice,
    category,
    brand,
    stock,
    featured,
  } = req.body;

  // Validation
  if (!name || !description || !price || !category || !brand || !stock) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('Please upload at least one image');
  }

  // Support two upload flows:
  // 1) multer-storage-cloudinary already uploaded files to Cloudinary (req.files[i].path or .location)
  // 2) multer used memory storage and provided buffers (req.files[i].buffer)
  let images = [];
  if (req.files[0].buffer) {
    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );

    images = uploadedImages.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
    }));
  } else {
    images = req.files.map((file) => ({
      url: file.path || file.location || file.secure_url || file.url,
      public_id: file.filename || file.public_id || file.public_id,
    }));
  }

  const product = await Product.create({
    name,
    description,
    price: Number(price),
    originalPrice: Number(originalPrice) || 0,
    category,
    brand,
    stock: Number(stock),
    images,
    featured: featured === 'true' || featured === true,
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product,
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const {
    name,
    description,
    price,
    originalPrice,
    category,
    brand,
    stock,
    featured,
    isActive,
  } = req.body;

  // Upload new images if provided
  let newImages = [];
  if (req.files && req.files.length > 0) {
    if (req.files[0].buffer) {
      const uploadedImages = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );
      newImages = uploadedImages.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
      }));
    } else {
      newImages = req.files.map((file) => ({
        url: file.path || file.location || file.secure_url || file.url,
        public_id: file.filename || file.public_id || file.public_id,
      }));
    }
  }

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price ? Number(price) : product.price;
  product.originalPrice = originalPrice ? Number(originalPrice) : product.originalPrice;
  product.category = category || product.category;
  product.brand = brand || product.brand;
  product.stock = stock ? Number(stock) : product.stock;
  product.featured = featured !== undefined ? featured === 'true' || featured === true : product.featured;
  product.isActive = isActive !== undefined ? isActive === 'true' || isActive === true : product.isActive;

  if (newImages.length > 0) {
    product.images = [...product.images, ...newImages];
  }

  const updatedProduct = await product.save();

  res.json({
    success: true,
    message: 'Product updated successfully',
    product: updatedProduct,
  });
});

// @desc    Delete product image
// @route   DELETE /api/products/:id/images/:public_id
// @access  Private/Admin
const deleteProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const publicId = decodeURIComponent(req.params.public_id);
  await cloudinary.uploader.destroy(publicId);

  product.images = product.images.filter(
    (img) => img.public_id !== publicId
  );

  await product.save();

  res.json({
    success: true,
    message: 'Image deleted successfully',
    images: product.images,
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Delete all images from Cloudinary
  await Promise.all(
    product.images.map((img) => cloudinary.uploader.destroy(img.public_id))
  );

  await product.deleteOne();

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    res.status(400);
    throw new Error('Please provide rating and comment');
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You already reviewed this product');
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.ratings =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({
    success: true,
    message: 'Review added successfully',
  });
});

// @desc    Get all products for admin
// @route   GET /api/products/admin/all
// @access  Private/Admin
const getAdminProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const count = await Product.countDocuments();
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

export {
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
};