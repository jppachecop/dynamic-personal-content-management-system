import axios from 'axios';
import { User, Note, Tag, Category } from '@/types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Generic API functions
export const api = {
  // Generic GET request
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(endpoint);
    if (!response.data.success) {
      throw new Error(response.data.error || 'API request failed');
    }
    return response.data.data!;
  },

  // Generic POST request
  post: async <T, D = unknown>(endpoint: string, data: D): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(endpoint, data);
    if (!response.data.success) {
      throw new Error(response.data.error || 'API request failed');
    }
    return response.data.data!;
  },

  // Generic PUT request
  put: async <T, D = unknown>(endpoint: string, data: D): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(endpoint, data);
    if (!response.data.success) {
      throw new Error(response.data.error || 'API request failed');
    }
    return response.data.data!;
  },

  // Generic DELETE request
  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(endpoint);
    if (!response.data.success) {
      throw new Error(response.data.error || 'API request failed');
    }
    return response.data.data!;
  },
};

// User API functions
export const userApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<User>('/users', user),
  update: (id: string, user: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) => 
    api.put<User>(`/users/${id}`, user),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Category API functions
export const categoryApi = {
  getAll: (withUsage?: boolean) => 
    api.get<Category[]>(`/categories${withUsage ? '?withUsage=true' : ''}`),
  getById: (id: string) => api.get<Category>(`/categories/${id}`),
  create: (category: Omit<Category, 'id'>) => 
    api.post<Category>('/categories', category),
  update: (id: string, category: Partial<Omit<Category, 'id'>>) => 
    api.put<Category>(`/categories/${id}`, category),
  delete: (id: string) => api.delete(`/categories/${id}`),
  getUsage: (id: string) => api.get<{ count: number }>(`/categories/${id}/usage`),
};

// Tag API functions
export const tagApi = {
  getAll: () => api.get<Tag[]>('/tags'),
  getPopular: (limit = 10) => api.get<Tag[]>(`/tags?popular=true&limit=${limit}`),
  getById: (id: string) => api.get<Tag>(`/tags/${id}`),
  create: (tag: Omit<Tag, 'id'>) => 
    api.post<Tag>('/tags', tag),
  update: (id: string, tag: Partial<Omit<Tag, 'id'>>) => 
    api.put<Tag>(`/tags/${id}`, tag),
  delete: (id: string) => api.delete(`/tags/${id}`),
  increment: (id: string) => api.put(`/tags/${id}/increment`, {}),
  decrement: (id: string) => api.put(`/tags/${id}/decrement`, {}),
  updateCounts: () => api.post('/tags/update-counts', {}),
};

// Note API functions
export const noteApi = {
  getAll: (params?: {
    userId?: string;
    category?: string;
    tag?: string;
    favorites?: boolean;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.userId) searchParams.append('userId', params.userId);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.tag) searchParams.append('tag', params.tag);
    if (params?.favorites) searchParams.append('favorites', 'true');
    if (params?.search) searchParams.append('search', params.search);
    
    const queryString = searchParams.toString();
    return api.get<Note[]>(`/notes${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id: string) => api.get<Note>(`/notes/${id}`),
  getByUserId: (userId: string) => api.get<Note[]>(`/notes/user/${userId}`),
  create: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<Note>('/notes', note),
  update: (id: string, note: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => 
    api.put<Note>(`/notes/${id}`, note),
  delete: (id: string) => api.delete(`/notes/${id}`),
};

// Health check
export const healthApi = {
  check: () => api.get<{ message: string; timestamp: string; environment: string }>('/health'),
};

export default api;
