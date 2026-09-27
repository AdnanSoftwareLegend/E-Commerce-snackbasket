const Blog = require('../models/Blog');

// @desc Get All Blogs
// @route GET /api/v1/blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Single Blog by Slug
// @route GET /api/v1/blogs/:slug
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create Blog (Admin Only)
// @route POST /api/v1/blogs
const createBlog = async (req, res) => {
  try {
    const { title, content, image, category } = req.body;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const blogImage = req.file ? `/uploads/${req.file.filename}` : image;

    const blog = new Blog({ title, slug, content, image: blogImage, category });
    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getBlogs, getBlogBySlug, createBlog };