import prisma from "../config/prisma";
import { Note, CreateNoteInput, UpdateNoteInput } from "../types";

export class NoteRepository {
  async create(noteData: CreateNoteInput): Promise<Note> {
    const note = await prisma.note.create({
      data: {
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags,
        category: noteData.category,
        userId: noteData.userId,
        isFavorite: noteData.isFavorite || false,
      },
    });
    
    return note;
  }

  async findById(id: string): Promise<Note | null> {
    const note = await prisma.note.findUnique({
      where: { id },
    });
    
    return note;
  }

  async findAll(): Promise<Note[]> {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    return notes;
  }

  async findByUserId(userId: string): Promise<Note[]> {
    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    
    return notes;
  }

  async findByCategory(category: string): Promise<Note[]> {
    const notes = await prisma.note.findMany({
      where: { category },
      orderBy: { createdAt: "desc" },
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
    });
    
    return notes;
  }

  async update(noteData: UpdateNoteInput): Promise<Note> {
    if (!noteData.id) {
      throw new Error("Note ID is required for update");
    }

    const { id, ...updateData } = noteData;
    
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
