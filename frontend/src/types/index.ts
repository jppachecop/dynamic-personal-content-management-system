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
  category: string;
  userId: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
}

export type ViewMode = 'grid' | 'list';
export type SortBy = 'created' | 'updated' | 'title' | 'category';
export type SortOrder = 'asc' | 'desc';

export interface AppState {
  currentUser: User | null;
  selectedNote: Note | null;
  notes: Note[];
  tags: Tag[];
  categories: Category[];
  searchQuery: string;
  selectedCategory: string | null;
  selectedTags: string[];
  viewMode: ViewMode;
  sortBy: SortBy;
  sortOrder: SortOrder;
  isLoading: boolean;
  sidebarOpen: boolean;
}