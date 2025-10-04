import prisma from "../config/prisma";
import { Tag, CreateTagInput, UpdateTagInput } from "../types";

export class TagRepository {
  async create(tagData: CreateTagInput): Promise<Tag> {
    const tag = await prisma.tag.create({
      data: {
        name: tagData.name,
        color: tagData.color,
        count: tagData.count || 0,
      },
    });
    
    return tag;
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = await prisma.tag.findUnique({
      where: { id },
    });
    
    return tag;
  }

  async findByName(name: string): Promise<Tag | null> {
    const tag = await prisma.tag.findUnique({
      where: { name },
    });
    
    return tag;
  }

  async findAll(): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
    });
    
    return tags;
  }

  async findPopular(limit: number = 10): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      orderBy: [
        { count: "desc" },
        { name: "asc" },
      ],
      take: limit,
    });
    
    return tags;
  }

  async update(tagData: UpdateTagInput): Promise<Tag> {
    if (!tagData.id) {
      throw new Error("Tag ID is required for update");
    }

    const { id, ...updateData } = tagData;
    
    // Remove undefined values
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(cleanUpdateData).length === 0) {
      throw new Error("No fields to update");
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: cleanUpdateData,
    });

    return tag;
  }

  async incrementCount(id: string): Promise<Tag> {
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        count: {
          increment: 1,
        },
      },
    });

    return tag;
  }

  async decrementCount(id: string): Promise<Tag> {
    const currentTag = await prisma.tag.findUnique({
      where: { id },
      select: { count: true },
    });

    if (!currentTag) {
      throw new Error("Tag not found");
    }

    const newCount = Math.max(currentTag.count - 1, 0);

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        count: newCount,
      },
    });

    return tag;
  }

  async delete(id: string): Promise<void> {
    await prisma.tag.delete({
      where: { id },
    });
  }

  async exists(name: string): Promise<boolean> {
    const tag = await prisma.tag.findUnique({
      where: { name },
      select: { id: true },
    });
    
    return tag !== null;
  }

  async updateTagCounts(): Promise<void> {
    // Get all tags
    const tags = await prisma.tag.findMany();
    
    // Update each tag's count based on actual usage in notes
    for (const tag of tags) {
      const count = await prisma.note.count({
        where: {
          tags: {
            has: tag.name,
          },
        },
      });
      
      await prisma.tag.update({
        where: { id: tag.id },
        data: { count },
      });
    }
  }
}
