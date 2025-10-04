import { Router, Request, Response } from "express";
import { TagRepository } from "../repositories/TagRepository";
import { ApiResponse, CreateTagInput, UpdateTagInput } from "../types";
import {
  validateId,
  createTagValidation,
  validateUpdateTag,
} from "../middleware/validation";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();
const tagRepository = new TagRepository();

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Get all tags with optional popularity filter
 *     tags: [Tags]
 *     parameters:
 *       - name: popular
 *         in: query
 *         description: Get popular tags only
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - name: limit
 *         in: query
 *         description: Limit number of popular tags (default 10)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: List of tags
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
 *                     $ref: '#/components/schemas/Tag'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { popular, limit } = req.query;

    let tags;
    if (popular === "true") {
      const limitNum = limit ? parseInt(limit as string) : 10;
      tags = await tagRepository.findPopular(limitNum);
    } else {
      tags = await tagRepository.findAll();
    }

    res.json({
      success: true,
      data: tags,
    });
  })
);

// GET /api/tags/:id - Get tag by ID
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

    const tag = await tagRepository.findById(id);

    if (!tag) {
      res.status(404).json({
        success: false,
        error: "Tag not found",
      });
      return;
    }

    res.json({
      success: true,
      data: tag,
    });
  })
);

// POST /api/tags - Create new tag
router.post(
  "/",
  createTagValidation,
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const tagData: CreateTagInput = req.body;

    // Check if tag name already exists
    const existingTag = await tagRepository.findByName(tagData.name);
    if (existingTag) {
      res.status(409).json({
        success: false,
        error: "Tag name already exists",
      });
      return;
    }

    const tag = await tagRepository.create(tagData);
    res.status(201).json({
      success: true,
      data: tag,
      message: "Tag created successfully",
    });
  })
);

// PUT /api/tags/:id - Update tag
router.put(
  "/:id",
  validateUpdateTag,
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "Invalid ID",
      });
      return;
    }

    const updateData: Partial<CreateTagInput> = req.body;

    // Check if tag exists
    const existingTag = await tagRepository.findById(id);
    if (!existingTag) {
      res.status(404).json({
        success: false,
        error: "Tag not found",
      });
      return;
    }

    // Check if name is being updated and already exists
    if (updateData.name && updateData.name !== existingTag.name) {
      const nameExists = await tagRepository.findByName(updateData.name);
      if (nameExists) {
        res.status(409).json({
          success: false,
          error: "Tag name already exists",
        });
        return;
      }
    }

    const tag = await tagRepository.update({
      id,
      ...updateData,
    } as UpdateTagInput);
    res.json({
      success: true,
      data: tag,
      message: "Tag updated successfully",
    });
  })
);

// PUT /api/tags/:id/increment - Increment tag count
router.put(
  "/:id/increment",
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

    // Check if tag exists
    const existingTag = await tagRepository.findById(id);
    if (!existingTag) {
      res.status(404).json({
        success: false,
        error: "Tag not found",
      });
      return;
    }

    const tag = await tagRepository.incrementCount(id);
    res.json({
      success: true,
      data: tag,
      message: "Tag count incremented",
    });
  })
);

// PUT /api/tags/:id/decrement - Decrement tag count
router.put(
  "/:id/decrement",
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

    // Check if tag exists
    const existingTag = await tagRepository.findById(id);
    if (!existingTag) {
      res.status(404).json({
        success: false,
        error: "Tag not found",
      });
      return;
    }

    const tag = await tagRepository.decrementCount(id);
    res.json({
      success: true,
      data: tag,
      message: "Tag count decremented",
    });
  })
);

// POST /api/tags/update-counts - Update all tag counts based on usage
router.post(
  "/update-counts",
  asyncHandler(async (_req: Request, res: Response<ApiResponse>) => {
    await tagRepository.updateTagCounts();
    res.json({
      success: true,
      message: "Tag counts updated successfully",
    });
  })
);

// DELETE /api/tags/:id - Delete tag
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

    // Check if tag exists
    const existingTag = await tagRepository.findById(id);
    if (!existingTag) {
      res.status(404).json({
        success: false,
        error: "Tag not found",
      });
      return;
    }

    await tagRepository.delete(id);
    res.json({
      success: true,
      message: "Tag deleted successfully",
    });
  })
);

export default router;
