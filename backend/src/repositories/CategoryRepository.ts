import prisma from "../config/prisma";
import { Category, CreateCategoryInput } from "../types";

export class CategoryRepository {
  async create(categoryData: CreateCategoryInput): Promise<Category> {
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        color: categoryData.color,
        userId: categoryData.userId,
      },
    });

    return category;
  }

  async findById(id: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    return category;
  }

  async findByName(name: string, userId: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: {
        name_userId: {
          name,
          userId,
        },
      },
    });

    return category;
  }

  async findAll(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    return categories;
  }

  async findByUserId(userId: string): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });

    return categories;
  }

  async getCategoryUsageCount(categoryId: string): Promise<number> {
    const count = await prisma.note.count({
      where: { categoryId },
    });

    return count;
  }
}
