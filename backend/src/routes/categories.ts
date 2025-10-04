import { Router, Request, Response } from "express";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { ApiResponse, CreateCategoryInput, UpdateCategoryInput } from "../types";
import {
  validateCreateCategory,
  validateUpdateCategory,
  validateId,
} from "../middleware/validation";
import { asyncHandler } from "../middleware/errorHandler";

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
    if (userId && typeof userId === 'string') {
      categories = await categoryRepository.findByUserId(userId);
    } else {
      categories = await categoryRepository.findAll();
    }

    if (withUsage === "true") {
      categories = await Promise.all(
        categories.map(async (category) => {
          const usageCount = await categoryRepository.getCategoryUsageCount(
            category.name
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

// GET /api/categories/:id - Get category by ID
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

    const category = await categoryRepository.findById(id);

    if (!category) {
      res.status(404).json({
        success: false,
        error: "Category not found",
      });
      return;
    }

    res.json({
      success: true,
      data: category,
    });
  })
);

// GET /api/categories/:id/usage - Get category usage count
router.get(
  "/:id/usage",
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

    // Check if category exists
    const category = await categoryRepository.findById(id);
    if (!category) {
      res.status(404).json({
        success: false,
        error: "Category not found",
      });
      return;
    }

    const usageCount = await categoryRepository.getCategoryUsageCount(
      category.name
    );
    res.json({
      success: true,
      data: {
        categoryId: id,
        categoryName: category.name,
        usageCount,
      },
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

// PUT /api/categories/:id - Update category
router.put(
  "/:id",
  validateUpdateCategory,
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "Invalid ID",
      });
      return;
    }

    const updateData: Partial<CreateCategoryInput> = req.body;

    // Check if category exists
    const existingCategory = await categoryRepository.findById(id);
    if (!existingCategory) {
      res.status(404).json({
        success: false,
        error: "Category not found",
      });
      return;
    }

    // Check if name is being updated and already exists for this user
    if (updateData.name && updateData.name !== existingCategory.name) {
      const nameExists = await categoryRepository.findByName(updateData.name, existingCategory.userId);
      if (nameExists) {
        res.status(409).json({
          success: false,
          error: "Category name already exists",
        });
        return;
      }
    }

    const category = await categoryRepository.update({
      id,
      ...updateData,
    } as UpdateCategoryInput);
    res.json({
      success: true,
      data: category,
      message: "Category updated successfully",
    });
  })
);

// DELETE /api/categories/:id - Delete category
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

    // Check if category exists
    const existingCategory = await categoryRepository.findById(id);
    if (!existingCategory) {
      res.status(404).json({
        success: false,
        error: "Category not found",
      });
      return;
    }

    // Check if category is being used
    const usageCount = await categoryRepository.getCategoryUsageCount(
      existingCategory.name
    );
    if (usageCount > 0) {
      res.status(400).json({
        success: false,
        error: `Cannot delete category. It is being used by ${usageCount} note(s)`,
      });
      return;
    }

    await categoryRepository.delete(id);
    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  })
);

export default router;
