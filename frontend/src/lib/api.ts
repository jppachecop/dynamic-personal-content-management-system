import axios from "axios";
import { User, Note, Category } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const api = {
  // Generic GET request
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(endpoint);
    if (!response.data.success) {
      throw new Error(response.data.error || "API request failed");
    }
    return response.data.data!;
  },

  // Generic POST request
  post: async <T, D = unknown>(endpoint: string, data: D): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(endpoint, data);
    if (!response.data.success) {
      throw new Error(response.data.error || "API request failed");
    }
    return response.data.data!;
  },

  // Generic PUT request
  put: async <T, D = unknown>(endpoint: string, data: D): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(endpoint, data);
    if (!response.data.success) {
      throw new Error(response.data.error || "API request failed");
    }
    return response.data.data!;
  },

  // Generic DELETE request
  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(endpoint);
    if (!response.data.success) {
      throw new Error(response.data.error || "API request failed");
    }
    return response.data.data!;
  },
};

export const userApi = {
  login: (email: string) => api.post<User>(`/users/login`, { email }),
  create: (user: Omit<User, "id" | "createdAt" | "updatedAt">) =>
    api.post<User>("/users", user),
  update: (
    id: string,
    user: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ) => api.put<User>(`/users/${id}`, user),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export const categoryApi = {
  getAll: (userId?: string, withUsage?: boolean) => {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (withUsage) params.append("withUsage", "true");
    const queryString = params.toString();
    return api.get<Category[]>(
      `/categories${queryString ? "?" + queryString : ""}`
    );
  },
  create: (category: Omit<Category, "id">) =>
    api.post<Category>("/categories", category),
};

export const noteApi = {
  getByUserId: (userId: string) => api.get<Note[]>(`/notes/user/${userId}`),
  create: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) =>
    api.post<Note>("/notes", note),
  update: (
    id: string,
    note: Partial<Omit<Note, "id" | "createdAt" | "updatedAt">>
  ) => api.put<Note>(`/notes/${id}`, note),
  delete: (id: string) => api.delete(`/notes/${id}`),
};

export default api;
