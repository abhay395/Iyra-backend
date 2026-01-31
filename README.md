# Iyra Media Backend API

A production-ready Node.js/Express backend for a blog platform with Cloudinary image handling.

## Features

- ✅ Create, Read, Update, Delete (CRUD) blog posts
- ✅ Image upload and management via Cloudinary
- ✅ Pagination support for blog listings
- ✅ Comprehensive error handling
- ✅ MongoDB integration
- ✅ CORS enabled
- ✅ Security headers with Helmet
- ✅ Request compression
- ✅ Request logging with Morgan

## Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account

## Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update with your actual credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Start the server:**
   ```bash
   # Development with auto-reload
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Blog Posts

#### Create Blog Post
- **Endpoint:** `POST /api/blogs`
- **Content-Type:** `multipart/form-data`
- **Body:**
  ```json
  {
    "title": "Blog Title",
    "content": "Blog content here",
    "coverImage": <file>,
    "author": "Author Name (optional)",
    "published": true
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Blog created successfully",
    "blog": { ...blog data }
  }
  ```

#### Get All Blogs
- **Endpoint:** `GET /api/blogs?page=1&limit=10`
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 10)
- **Response:**
  ```json
  {
    "success": true,
    "page": 1,
    "limit": 10,
    "totalBlogs": 50,
    "totalPages": 5,
    "blogs": [ ...blogs ]
  }
  ```

#### Get Single Blog
- **Endpoint:** `GET /api/blogs/:id`
- **Response:**
  ```json
  {
    "success": true,
    "blog": { ...blog data }
  }
  ```

#### Update Blog Post
- **Endpoint:** `PUT /api/blogs/:id`
- **Content-Type:** `multipart/form-data`
- **Body:** Same as create (all fields optional)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Blog updated successfully",
    "blog": { ...updated blog data }
  }
  ```

#### Delete Blog Post
- **Endpoint:** `DELETE /api/blogs/:id`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Blog deleted successfully"
  }
  ```

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Codes
- `400` - Bad Request (validation error, missing fields)
- `404` - Not Found (blog post doesn't exist)
- `500` - Internal Server Error

## File Structure

```
├── config/
│   ├── db.js              # Database connection
│   └── cloudinary.js      # Cloudinary configuration
├── controllers/
│   └── blog.controller.js # Blog business logic
├── middleware/
│   ├── auth.middleware.js # Authentication (future)
│   ├── error.middleware.js # Global error handler
│   └── upload.middleware.js # Multer & Cloudinary setup
├── models/
│   └── blogs.js           # MongoDB schema
├── routes/
│   └── blog.routes.js     # API routes
├── utils/
│   ├── ApiError.js        # Error utility (future)
│   └── ApiResponse.js     # Response utility (future)
├── .env.example           # Environment variables template
├── app.js                 # Express app setup
└── server.js              # Server entry point
```

## Best Practices Implemented

1. **Error Handling**: Centralized error middleware handles all errors consistently
2. **Input Validation**: Request parameters and file uploads are validated
3. **Security**:
   - Helmet for HTTP headers
   - CORS protection
   - File type validation (only images allowed)
   - File size limit (5MB max)
4. **Performance**:
   - Response compression
   - Pagination support
   - Indexed MongoDB queries
5. **Image Management**:
   - Automatic cleanup on failed operations
   - Image deletion from Cloudinary on blog deletion
   - Support for multiple image formats

## Cloudinary Setup

1. Create a Cloudinary account at https://cloudinary.com
2. Get your credentials from the dashboard
3. Add credentials to `.env` file
4. The system automatically organizes uploads in `iyra-media/blogs` folder

## Testing the API

### Using cURL

```bash
# Create blog post
curl -X POST http://localhost:5000/api/blogs \
  -F "title=My Blog Post" \
  -F "content=Blog content here" \
  -F "coverImage=@/path/to/image.jpg" \
  -F "author=John Doe"

# Get all blogs
curl http://localhost:5000/api/blogs

# Get single blog
curl http://localhost:5000/api/blogs/{blogId}

# Update blog
curl -X PUT http://localhost:5000/api/blogs/{blogId} \
  -F "title=Updated Title" \
  -F "content=Updated content"

# Delete blog
curl -X DELETE http://localhost:5000/api/blogs/{blogId}
```

### Using Postman

1. Import the API endpoints
2. Set up form-data for POST/PUT requests
3. Add `coverImage` as File type in Postman
4. Test each endpoint

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | No (default: 5000) |
| NODE_ENV | Environment mode | No (default: development) |
| MONGODB_URI | MongoDB connection string | Yes |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | Yes |
| CLOUDINARY_API_KEY | Cloudinary API key | Yes |
| CLOUDINARY_API_SECRET | Cloudinary API secret | Yes |

## Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use environment-specific configurations
3. Enable HTTPS/SSL
4. Set up proper CORS origins
5. Use a process manager (PM2)
6. Set up monitoring and logging

## Future Enhancements

- [ ] User authentication
- [ ] Blog categories/tags
- [ ] Comments system
- [ ] Search functionality
- [ ] Rate limiting
- [ ] API versioning
- [ ] Unit tests
- [ ] API documentation (Swagger)

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
