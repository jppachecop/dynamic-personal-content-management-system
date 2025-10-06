import { Router, Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { ApiResponse, CreateUserInput, UpdateUserInput } from "../types";
import {
  validateCreateUser,
  validateUpdateUser,
  validateId,
} from "../middleware/validation";
import { asyncHandler } from "../middleware/handlers";

const router = Router();
const userRepository = new UserRepository();

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user by email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        error: "Email é obrigatório",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: "Formato de email inválido",
      });
      return;
    }

    const user = await userRepository.findByEmail(email);

    if (!user) {
      res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
      return;
    }

    res.json({
      success: true,
      data: user,
      message: "Login realizado com sucesso",
    });
  })
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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
        error: "Email já existe",
      });
      return;
    }

    const user = await userRepository.create(userData);
    res.status(201).json({
      success: true,
      data: user,
      message: "Usuário criado com sucesso",
    });
  })
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               email:
 *                 type: string
 *                 format: email
 *               avatar:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put(
  "/:id",
  validateUpdateUser,
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "ID inválido",
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
          error: "Email já existe",
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
      message: "Usuário atualizado com sucesso",
    });
  })
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *                   example: "User deleted successfully"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete(
  "/:id",
  validateId,
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "ID inválido",
      });
      return;
    }

    // Check if user exists
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
      return;
    }

    await userRepository.delete(id);
    res.json({
      success: true,
      message: "Usuário excluído com sucesso",
    });
  })
);

export default router;
