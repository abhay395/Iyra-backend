// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const compression = require("compression");
// const connectDB = require("./config/db");
// const errorHandler = require("./middleware/error.middleware");

// const app = express();

// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// app.use(cors({
//   origin: process.env.CLIENT_URL || "*",
//   credentials: true,
// }));

// app.use(helmet());
// app.use(compression());
// app.use(morgan("dev"));

// app.use("/api/blogs", require("./routes/blog.routes"));

// app.get("/", (req, res) => {
//   res.send("Welcome to the Blog API");
// });

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// app.use(errorHandler);

// const startServer = async () => {
//   await connectDB();
//   app.listen(3000, () => {
//     console.log("Server running on port 3000");
//   });
// };

// startServer();

// module.exports = app;
