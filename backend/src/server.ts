import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";

import { errorHandler, notFoundHandler } from "./middleware/handlers";
import { setupSwagger } from "./config/swagger";
import usersRouter from "./routes/users";
import notesRouter from "./routes/notes";
import categoriesRouter from "./routes/categories";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env["PORT"] || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env["FRONTEND_URL"] || "http://localhost:3000",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Setup Swagger documentation
setupSwagger(app);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Server is running"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: "development"
 */
app.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env["NODE_ENV"] || "development",
  });
});

// API routes
app.use("/api/users", usersRouter);
app.use("/api/notes", notesRouter);
app.use("/api/categories", categoriesRouter);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env["NODE_ENV"] || "development"}`);
  console.log(
    `🌐 CORS enabled for: ${
      process.env["FRONTEND_URL"] || "http://localhost:3000"
    }`
  );
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
    process.exit(0);
  });
});

export default app;
