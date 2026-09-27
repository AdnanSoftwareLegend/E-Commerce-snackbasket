const express = require('express');
const { getBlogs, getBlogBySlug, createBlog } = require('../controllers/blogController');
const { protect, admin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, admin, upload.single('image'), createBlog);

router.get('/:slug', getBlogBySlug);

module.exports = router;