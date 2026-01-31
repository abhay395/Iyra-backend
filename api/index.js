// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const compression = require("compression");
// const connectDB = require("../config/db"); // Adjusted path assuming file is in /api
// const errorHandler = require("../middleware/error.middleware"); // Adjusted path

// const app = express();

// // Middleware setup
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// app.use(cors({
//   origin: process.env.CLIENT_URL || "*",
//   credentials: true,
// }));

// app.use(helmet());
// app.use(compression());
// app.use(morgan("dev"));

// // --- KEY CHANGE: Database Connection Middleware ---
// // In serverless, we connect within the request flow to ensure
// // the connection is alive even if the container was frozen.
// app.use(async (req, res, next) => {
//   try {
//     await connectDB();
//     next();
//   } catch (err) {
//     console.error("Database connection failed:", err);
//     res.status(500).json({ success: false, message: "Database connection error" });
//   }
// });

// // Routes
// app.use("/api/blogs", require("../routes/blog.routes")); // Adjusted path

// app.get("/", (req, res) => {
//   res.send("Welcome to the Blog API");
// });

// // 404 Handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// app.use(errorHandler);

// module.exports = app;