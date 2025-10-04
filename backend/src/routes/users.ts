import { Router, Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { ApiResponse, CreateUserInput, UpdateUserInput } from "../types";
import {
  validateCreateUser,
  validateUpdateUser,
  validateId,
} from "../middleware/validation";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();
const userRepository = new UserRepository();

// GET /api/users - Get all users
router.get(
  "/",
  asyncHandler(async (_, res: Response<ApiResponse>) => {
    const users = await userRepository.findAll();
    res.json({
      success: true,
      data: users,
    });
  })
);

// GET /api/users/:id - Get user by ID
router.get(
  "/:id",
  validateId,
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "Invalid ID",
      });
      return;
    }

    const user = await userRepository.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  })
);

// POST /api/users - Create new user
router.post(
  "/",
  validateCreateUser,
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const userData: CreateUserInput = req.body;

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: "Email already exists",
      });
      return;
    }

    const user = await userRepository.create(userData);
    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  })
);

// PUT /api/users/:id - Update user
router.put(
  "/:id",
  validateUpdateUser,
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "Invalid ID",
      });
      return;
    }

    const updateData: Partial<CreateUserInput> = req.body;

    // Check if user exists
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    // Check if email is being updated and already exists
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await userRepository.findByEmail(updateData.email);
      if (emailExists) {
        res.status(409).json({
          success: false,
          error: "Email already exists",
        });
        return;
      }
    }

    const user = await userRepository.update({
      id,
      ...updateData,
    } as UpdateUserInput);
    res.json({
      success: true,
      data: user,
      message: "User updated successfully",
    });
  })
);

// DELETE /api/users/:id - Delete user
router.delete(
  "/:id",
  validateId,
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "Invalid ID",
      });
      return;
    }

    // Check if user exists
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    await userRepository.delete(id);
    res.json({
      success: true,
      message: "User deleted successfully",
    });
  })
);

export default router;
