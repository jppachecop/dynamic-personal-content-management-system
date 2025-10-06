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
    message: "Servidor está funcionando",
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

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env["NODE_ENV"] || "development"}`);
  console.log(
    `🌐 CORS habilitado para: ${
      process.env["FRONTEND_URL"] || "http://localhost:3000"
    }`
  );
});

// Encerramento gracioso
process.on("SIGTERM", () => {
  console.log("SIGTERM recebido. Encerrando graciosamente...");
  server.close(() => {
    console.log("Processo terminado");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT recebido. Encerrando graciosamente...");
  server.close(() => {
    console.log("Processo terminado");
    process.exit(0);
  });
});

export default app;
