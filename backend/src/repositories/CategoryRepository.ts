import prisma from "../config/prisma";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "../types";

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
          userId
        }
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

  async update(categoryData: UpdateCategoryInput): Promise<Category> {
    if (!categoryData.id) {
      throw new Error("Category ID is required for update");
    }

    const { id, ...updateData } = categoryData;

    // Remove undefined values
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(cleanUpdateData).length === 0) {
      throw new Error("No fields to update");
    }

    const category = await prisma.category.update({
      where: { id },
      data: cleanUpdateData,
    });

    return category;
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }

  async exists(name: string, userId: string): Promise<boolean> {
    const category = await prisma.category.findUnique({
      where: { 
        name_userId: {
          name,
          userId
        }
      },
      select: { id: true },
    });

    return category !== null;
  }

  async getCategoryUsageCount(categoryId: string): Promise<number> {
    const count = await prisma.note.count({
      where: { categoryId },
    });

    return count;
  }

  async getCategoriesWithUsage(): Promise<Array<Category & { usageCount: number }>> {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    const categoriesWithUsage = await Promise.all(
      categories.map(async (category) => {
        const usageCount = await prisma.note.count({
          where: { categoryId: category.id },
        });

        return {
          ...category,
          usageCount,
        };
      })
    );

    return categoriesWithUsage;
  }

  async findOrCreateDefaultCategory(userId: string): Promise<Category> {
    // Try to find an existing default category
    let defaultCategory = await prisma.category.findFirst({
      where: {
        userId,
        name: "Geral",
      },
    });

    // If no default category exists, create one
    if (!defaultCategory) {
      defaultCategory = await prisma.category.create({
        data: {
          name: "Geral",
          color: "#3B82F6",
          userId,
        },
      });
    }

    return defaultCategory;
  }
}
