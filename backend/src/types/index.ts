export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string | null;
  tags: string[];
  categoryId: string;
  userId: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: Category; // Optional for when we include the category relation
}

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
}

// Input types for creation (omit auto-generated fields)
export type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt">;
export type CreateNoteInput = Omit<
  Note,
  "id" | "createdAt" | "updatedAt" | "category"
> & {
  categoryId: string; // Make categoryId optional in creation
};
export type CreateCategoryInput = Omit<Category, "id">;

// Update types (partial with required id)
export type UpdateUserInput = Partial<Omit<User, "createdAt" | "updatedAt">>;
export type UpdateNoteInput = Partial<Omit<Note, "createdAt" | "updatedAt">>;

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
