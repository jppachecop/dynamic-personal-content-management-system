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
  usageCount?: number;
}
