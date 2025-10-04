export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  userId: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}


// Input types for creation (omit auto-generated fields)
export type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt">;
export type CreateNoteInput = Omit<Note, "id" | "createdAt" | "updatedAt">;
export type CreateTagInput = Omit<Tag, "id">;
export type CreateCategoryInput = Omit<Category, "id">;

// Update types (partial with required id)
export type UpdateUserInput = Partial<Omit<User, "createdAt" | "updatedAt">>;
export type UpdateNoteInput = Partial<Omit<Note, "createdAt" | "updatedAt">>;
export type UpdateTagInput = Partial<Tag>;
export type UpdateCategoryInput = Partial<Category>;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
