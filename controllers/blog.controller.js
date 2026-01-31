const { default: slugify } = require("slugify");
const Blog = require("../models/Blogs");
const cloudinary = require("../config/cloudinary");

// Extract Cloudinary public_id from a hosted image URL
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return null;
    let afterUpload = url.substring(uploadIndex + '/upload/'.length);
    // remove version segment like v123456/
    afterUpload = afterUpload.replace(/^v\d+\//, '');
    // strip query params if any
    afterUpload = afterUpload.split('?')[0];
    // strip file extension
    const lastDot = afterUpload.lastIndexOf('.');
    if (lastDot !== -1) afterUpload = afterUpload.substring(0, lastDot);
    return afterUpload;
  } catch (err) {
    return null;
  }
};

// Create a new blog post
exports.createBlog = async (req, res, next) => {
  try {
    // Validate required fields
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Get cover image URL from uploaded file
    let coverImageUrl = req.body.coverImage;
    if (req.file) {
      coverImageUrl = req.file.path;
    }

    if (!coverImageUrl) {
      return res.status(400).json({
        success: false,
        message: "Cover image is required",
      });
    }

    const newBlog = await Blog.create({
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      coverImage: coverImageUrl,
      slug: slugify(req.body.title, { lower: true }),
      author: req.body.author || "Iyra Media",
      published: req.body.published === "true" || req.body.published === true,
      Keywords: req.body.Keywords || [],
      Meta_description: req.body.Meta_description || null,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    // Delete uploaded image from Cloudinary if blog creation fails
    if (req.file) {
      const publicId = getPublicIdFromUrl(req.file.path) || req.file.filename;
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch((err) => {
          console.error("Error deleting image from Cloudinary:", err);
        });
      }
    }
    next(error);
  }
};

exports.getAllBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be positive integers",
      });
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalBlogs = await Blog.countDocuments();

    res.status(200).json({
      success: true,
      page,
      limit,
      totalBlogs,
      totalPages: Math.ceil(totalBlogs / limit),
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

exports.editBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Update cover image if new one is provided
    let coverImageUrl = req.body.coverImage || blog.coverImage;
    if (req.file) {
      // Delete old image from Cloudinary
      if (blog.coverImage) {
        const oldPublicId = getPublicIdFromUrl(blog.coverImage);
        if (oldPublicId) {
          await cloudinary.uploader.destroy(oldPublicId).catch((err) => {
            console.error("Error deleting old image from Cloudinary:", err);
          });
        }
      }
      coverImageUrl = req.file.path;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title: req.body.title?.trim() || blog.title,
        content: req.body.content?.trim() || blog.content,
        coverImage: coverImageUrl,
        slug: req.body.title
          ? slugify(req.body.title, { lower: true })
          : blog.slug,
        author: req.body.author || blog.author,
        published:
          req.body.published !== undefined
            ? req.body.published === "true" || req.body.published === true
            : blog.published,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    // Delete uploaded image from Cloudinary if update fails
    if (req.file) {
      const publicId = getPublicIdFromUrl(req.file.path) || req.file.filename;
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch((err) => {
          console.error("Error deleting image from Cloudinary:", err);
        });
      }
    }
    next(error);
  }
};

exports.getBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Delete cover image from Cloudinary
    if (blog.coverImage) {
      try {
        const publicId = getPublicIdFromUrl(blog.coverImage);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
      }
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};