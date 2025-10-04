import { Router, Request, Response } from 'express';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { ApiResponse, CreateCategoryInput, UpdateCategoryInput } from '../types';
import { validateCreateCategory, validateUpdateCategory, validateId } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const categoryRepository = new CategoryRepository();

// GET /api/categories - Get all categories
router.get('/', asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { withUsage } = req.query;
  
  let categories;
  if (withUsage === 'true') {
    categories = await categoryRepository.getCategoriesWithUsage();
  } else {
    categories = await categoryRepository.findAll();
  }
  
  res.json({
    success: true,
    data: categories,
  });
}));

// GET /api/categories/:id - Get category by ID
router.get('/:id', validateId, asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { id } = req.params;
  const category = await categoryRepository.findById(id);
  
  if (!category) {
    res.status(404).json({
      success: false,
      error: 'Category not found',
    });
    return;
  }
  
  res.json({
    success: true,
    data: category,
  });
}));

// GET /api/categories/:id/usage - Get category usage count
router.get('/:id/usage', validateId, asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { id } = req.params;
  
  // Check if category exists
  const category = await categoryRepository.findById(id);
  if (!category) {
    res.status(404).json({
      success: false,
      error: 'Category not found',
    });
    return;
  }
  
  const usageCount = await categoryRepository.getCategoryUsageCount(category.name);
  res.json({
    success: true,
    data: {
      categoryId: id,
      categoryName: category.name,
      usageCount,
    },
  });
}));

// POST /api/categories - Create new category
router.post('/', validateCreateCategory, asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const categoryData: CreateCategoryInput = req.body;
  
  // Check if category name already exists
  const existingCategory = await categoryRepository.findByName(categoryData.name);
  if (existingCategory) {
    res.status(409).json({
      success: false,
      error: 'Category name already exists',
    });
    return;
  }
  
  const category = await categoryRepository.create(categoryData);
  res.status(201).json({
    success: true,
    data: category,
    message: 'Category created successfully',
  });
}));

// PUT /api/categories/:id - Update category
router.put('/:id', validateUpdateCategory, asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { id } = req.params;
  const updateData: Partial<CreateCategoryInput> = req.body;
  
  // Check if category exists
  const existingCategory = await categoryRepository.findById(id);
  if (!existingCategory) {
    res.status(404).json({
      success: false,
      error: 'Category not found',
    });
    return;
  }
  
  // Check if name is being updated and already exists
  if (updateData.name && updateData.name !== existingCategory.name) {
    const nameExists = await categoryRepository.findByName(updateData.name);
    if (nameExists) {
      res.status(409).json({
        success: false,
        error: 'Category name already exists',
      });
      return;
    }
  }
  
  const category = await categoryRepository.update({ id, ...updateData } as UpdateCategoryInput);
  res.json({
    success: true,
    data: category,
    message: 'Category updated successfully',
  });
}));

// DELETE /api/categories/:id - Delete category
router.delete('/:id', validateId, asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { id } = req.params;
  
  // Check if category exists
  const existingCategory = await categoryRepository.findById(id);
  if (!existingCategory) {
    res.status(404).json({
      success: false,
      error: 'Category not found',
    });
    return;
  }
  
  // Check if category is being used
  const usageCount = await categoryRepository.getCategoryUsageCount(existingCategory.name);
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
    message: 'Category deleted successfully',
  });
}));

export default router;
