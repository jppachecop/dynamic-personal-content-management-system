import { Router, Request, Response } from "express";
import { NoteRepository } from "../repositories/NoteRepository";
import { UserRepository } from "../repositories/UserRepository";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { ApiResponse, CreateNoteInput, UpdateNoteInput } from "../types";
import {
  validateCreateNote,
  validateUpdateNote,
  validateId,
  validateUserId,
} from "../middleware/validation";
import { asyncHandler } from "../middleware/handlers";

const router = Router();
const noteRepository = new NoteRepository();
const userRepository = new UserRepository();
const categoryRepository = new CategoryRepository();

// GET /api/notes/user/:userId - Get notes by user ID
router.get(
  "/user/:userId",
  validateUserId,
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: "Invalid user ID",
      });
      return;
    }

    // Check if user exists
    const userExists = await userRepository.exists(userId);
    if (!userExists) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    const notes = await noteRepository.findByUserId(userId);
    res.json({
      success: true,
      data: notes,
    });
  })
);

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNoteInput'
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *                 message:
 *                   type: string
 *                   example: "Note created successfully"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  "/",
  validateCreateNote,
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const noteData: CreateNoteInput = req.body;

    // Check if user exists
    const userExists = await userRepository.exists(noteData.userId);
    if (!userExists) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    const category = await categoryRepository.findById(noteData.categoryId);
    if (!category) {
      res.status(404).json({
        success: false,
        error: "Category not found",
      });
      return;
    }

    const note = await noteRepository.create(noteData);
    res.status(201).json({
      success: true,
      data: note,
      message: "Note created successfully",
    });
  })
);

// PUT /api/notes/:id - Update note
router.put(
  "/:id",
  validateUpdateNote,
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "Invalid ID",
      });
      return;
    }

    const updateData: Partial<CreateNoteInput> = req.body;

    // Check if note exists
    const existingNote = await noteRepository.findById(id);
    if (!existingNote) {
      res.status(404).json({
        success: false,
        error: "Note not found",
      });
      return;
    }

    const note = await noteRepository.update({
      id,
      ...updateData,
    } as UpdateNoteInput);
    res.json({
      success: true,
      data: note,
      message: "Note updated successfully",
    });
  })
);

// DELETE /api/notes/:id - Delete note
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

    // Check if note exists
    const existingNote = await noteRepository.findById(id);
    if (!existingNote) {
      res.status(404).json({
        success: false,
        error: "Note not found",
      });
      return;
    }

    await noteRepository.delete(id);
    res.json({
      success: true,
      message: "Note deleted successfully",
    });
  })
);

export default router;
