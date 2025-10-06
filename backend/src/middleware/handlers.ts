import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  _req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal Server Error";

  // PostgreSQL specific errors
  if (error.message.includes("duplicate key value")) {
    statusCode = 409;
    message = "Resource already exists";
  } else if (error.message.includes("foreign key constraint")) {
    statusCode = 400;
    message = "Invalid reference to related resource";
  } else if (error.message.includes("not found")) {
    statusCode = 404;
    message = "Resource not found";
  }

  // Log error for debugging
  if (statusCode >= 500) {
    console.error("Server Error:", error);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env["NODE_ENV"] === "development" && { stack: error.stack }),
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
