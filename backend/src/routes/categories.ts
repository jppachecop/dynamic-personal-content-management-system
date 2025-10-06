import { Request, Response, Router } from "express";
import { asyncHandler } from "../middleware/handlers";
import { validateCreateCategory } from "../middleware/validation";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { ApiResponse, CreateCategoryInput } from "../types";

const router = Router();
const categoryRepository = new CategoryRepository();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories with optional usage statistics
 *     tags: [Categories]
 *     parameters:
 *       - name: withUsage
 *         in: query
 *         description: Include usage statistics for each category
 *         schema:
 *           type: string
 *           enum: [true, false]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryInput'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *                   example: "Category created successfully"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { userId, withUsage } = req.query;

    let categories;
    if (userId && typeof userId === "string") {
      categories = await categoryRepository.findByUserId(userId);
    } else {
      categories = await categoryRepository.findAll();
    }

    if (withUsage === "true") {
      categories = await Promise.all(
        categories.map(async (category) => {
          const usageCount = await categoryRepository.getCategoryUsageCount(
            category.id
          );
          return {
            ...category,
            usageCount,
          };
        })
      );
    }

    res.json({
      success: true,
      data: categories,
    });
  })
);

// POST /api/categories - Create new category
router.post(
  "/",
  validateCreateCategory,
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const categoryData: CreateCategoryInput = req.body;

    // Check if category name already exists for this user
    const existingCategory = await categoryRepository.findByName(
      categoryData.name,
      categoryData.userId
    );
    if (existingCategory) {
      res.status(409).json({
        success: false,
        error: "Category name already exists",
      });
      return;
    }

    const category = await categoryRepository.create(categoryData);
    res.status(201).json({
      success: true,
      data: category,
      message: "Category created successfully",
    });
  })
);

export default router;
