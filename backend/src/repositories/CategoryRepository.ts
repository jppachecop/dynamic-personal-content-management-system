import prisma from "../config/prisma";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "../types";

export class CategoryRepository {
  async create(categoryData: CreateCategoryInput): Promise<Category> {
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        color: categoryData.color,
        icon: categoryData.icon,
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

  async findByName(name: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { name },
    });
    
    return category;
  }

  async findAll(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
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

  async exists(name: string): Promise<boolean> {
    const category = await prisma.category.findUnique({
      where: { name },
      select: { id: true },
    });
    
    return category !== null;
  }

  async getCategoryUsageCount(categoryName: string): Promise<number> {
    const count = await prisma.note.count({
      where: { category: categoryName },
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
          where: { category: category.name },
        });
        
        return {
          ...category,
          usageCount,
        };
      })
    );

    return categoriesWithUsage;
  }
}
