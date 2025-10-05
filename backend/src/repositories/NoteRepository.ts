import prisma from "../config/prisma";
import { Note, CreateNoteInput, UpdateNoteInput } from "../types";

export class NoteRepository {
  async create(noteData: CreateNoteInput): Promise<Note> {
    const note = await prisma.note.create({
      data: {
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags,
        categoryId: noteData.categoryId,
        userId: noteData.userId,
        isFavorite: noteData.isFavorite || false,
      },
      include: {
        category: true,
      },
    });
    
    return note;
  }

  async findById(id: string): Promise<Note | null> {
    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    
    return note;
  }

  async findAll(): Promise<Note[]> {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });
    
    return notes;
  }

  async findByUserId(userId: string): Promise<Note[]> {
    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });
    
    return notes;
  }

  async findByCategoryId(categoryId: string): Promise<Note[]> {
    const notes = await prisma.note.findMany({
      where: { categoryId },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });
    
    return notes;
  }

  async findByCategoryName(categoryName: string, userId: string): Promise<Note[]> {
    const notes = await prisma.note.findMany({
      where: {
        category: {
          name: categoryName,
          userId: userId,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });
    
    return notes;
  }

  async findByTag(tag: string): Promise<Note[]> {
    const notes = await prisma.note.findMany({
      where: {
        tags: {
          has: tag,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });
    
    return notes;
  }

  async findFavorites(userId?: string): Promise<Note[]> {
    const where: { isFavorite: boolean; userId?: string } = { isFavorite: true };
    
    if (userId) {
      where.userId = userId;
    }
    
    const notes = await prisma.note.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });
    
    return notes;
  }

  async search(searchTerm: string, userId?: string): Promise<Note[]> {
    const where: {
      OR: Array<{ title?: { contains: string; mode: "insensitive" } } | { content?: { contains: string; mode: "insensitive" } }>;
      userId?: string;
    } = {
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { content: { contains: searchTerm, mode: "insensitive" } },
      ],
    };
    
    if (userId) {
      where.userId = userId;
    }
    
    const notes = await prisma.note.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });
    
    return notes;
  }

  async update(noteData: UpdateNoteInput): Promise<Note> {
    if (!noteData.id) {
      throw new Error("Note ID is required for update");
    }

    const { id, category, ...updateData } = noteData;
    
    // Remove undefined values
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(cleanUpdateData).length === 0) {
      throw new Error("No fields to update");
    }

    const note = await prisma.note.update({
      where: { id },
      data: cleanUpdateData,
      include: {
        category: true,
      },
    });

    return note;
  }

  async delete(id: string): Promise<void> {
    await prisma.note.delete({
      where: { id },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await prisma.note.deleteMany({
      where: { userId },
    });
  }

  async countByUserId(userId: string): Promise<number> {
    const count = await prisma.note.count({
      where: { userId },
    });
    
    return count;
  }
}
