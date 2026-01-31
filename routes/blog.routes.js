const router = require("express").Router();
const blogController = require("../controllers/blog.controller");
const upload = require("../middleware/upload.middleware");

// Create a new blog post with image upload
router.post("/", upload.single("coverImage"), blogController.createBlog);

// Get all blogs with pagination
router.get("/", blogController.getAllBlogs);

// Get a single blog by ID
router.get("/:id", blogController.getBlog);

// Update a blog post
router.put("/:id", upload.single("coverImage"), blogController.editBlog);

// Delete a blog post
router.delete("/:id", blogController.deleteBlog);

module.exports = router;