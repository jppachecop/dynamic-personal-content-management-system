import { Router, Request, Response } from "express";
import { NoteRepository } from "../repositories/NoteRepository";
import { UserRepository } from "../repositories/UserRepository";
import { ApiResponse, CreateNoteInput, UpdateNoteInput } from "../types";
import {
  validateCreateNote,
  validateUpdateNote,
  validateId,
  validateUserId,
} from "../middleware/validation";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();
const noteRepository = new NoteRepository();
const userRepository = new UserRepository();

// GET /api/notes - Get all notes with optional filters
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { userId, category, tag, favorites, search } = req.query;

    let notes;

    if (search) {
      notes = await noteRepository.search(
        search as string,
        userId as string
      );
    } else if (favorites === "true") {
      notes = await noteRepository.findFavorites(userId as string);
    } else if (tag) {
      notes = await noteRepository.findByTag(tag as string);
    } else if (category) {
      notes = await noteRepository.findByCategory(category as string);
    } else if (userId) {
      notes = await noteRepository.findByUserId(userId as string);
    } else {
      notes = await noteRepository.findAll();
    }

    res.json({
      success: true,
      data: notes,
    });
  })
);

// GET /api/notes/:id - Get note by ID
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

    const note = await noteRepository.findById(id);

    if (!note) {
      res.status(404).json({
        success: false,
        error: "Note not found",
      });
      return;
    }

    res.json({
      success: true,
      data: note,
    });
  })
);

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

// POST /api/notes - Create new note
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
