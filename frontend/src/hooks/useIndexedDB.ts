import { useState, useEffect, useCallback } from 'react';
import { User, Note, Tag, Category } from '@/types';

const DB_NAME = 'SGCPD_Database';
const DB_VERSION = 1;

const STORES = {
  USERS: 'users',
  NOTES: 'notes',
  TAGS: 'tags',
  CATEGORIES: 'categories',
} as const;

class IndexedDBManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORES.USERS)) {
          const userStore = db.createObjectStore(STORES.USERS, { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
        }

        if (!db.objectStoreNames.contains(STORES.NOTES)) {
          const noteStore = db.createObjectStore(STORES.NOTES, { keyPath: 'id' });
          noteStore.createIndex('userId', 'userId', { unique: false });
          noteStore.createIndex('category', 'category', { unique: false });
          noteStore.createIndex('createdAt', 'createdAt', { unique: false });
          noteStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.TAGS)) {
          db.createObjectStore(STORES.TAGS, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.CATEGORIES)) {
          db.createObjectStore(STORES.CATEGORIES, { keyPath: 'id' });
        }
      };
    });
  }

  async create<T>(storeName: string, data: T): Promise<T> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(data);
    });
  }

  async read<T>(storeName: string, id: string): Promise<T | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async readAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async update<T>(storeName: string, data: T): Promise<T> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(data);
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getByIndex<T>(storeName: string, indexName: string, value: any): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }
}

export const useIndexedDB = () => {
  const [dbManager] = useState(() => new IndexedDBManager());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initDB = async () => {
      try {
        await dbManager.init();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize IndexedDB:', error);
      }
    };

    initDB();
  }, [dbManager]);

  const createUser = useCallback(async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const user: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return dbManager.create(STORES.USERS, user);
  }, [dbManager]);

  const getUser = useCallback(async (id: string) => {
    return dbManager.read<User>(STORES.USERS, id);
  }, [dbManager]);

  const getAllUsers = useCallback(async () => {
    return dbManager.readAll<User>(STORES.USERS);
  }, [dbManager]);

  const updateUser = useCallback(async (user: User) => {
    const updatedUser = { ...user, updatedAt: new Date() };
    return dbManager.update(STORES.USERS, updatedUser);
  }, [dbManager]);

  const deleteUser = useCallback(async (id: string) => {
    return dbManager.delete(STORES.USERS, id);
  }, [dbManager]);

  const createNote = useCallback(async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const note: Note = {
      ...noteData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return dbManager.create(STORES.NOTES, note);
  }, [dbManager]);

  const getNote = useCallback(async (id: string) => {
    return dbManager.read<Note>(STORES.NOTES, id);
  }, [dbManager]);

  const getAllNotes = useCallback(async () => {
    return dbManager.readAll<Note>(STORES.NOTES);
  }, [dbManager]);

  const getNotesByUser = useCallback(async (userId: string) => {
    return dbManager.getByIndex<Note>(STORES.NOTES, 'userId', userId);
  }, [dbManager]);

  const updateNote = useCallback(async (note: Note) => {
    const updatedNote = { ...note, updatedAt: new Date() };
    return dbManager.update(STORES.NOTES, updatedNote);
  }, [dbManager]);

  const deleteNote = useCallback(async (id: string) => {
    return dbManager.delete(STORES.NOTES, id);
  }, [dbManager]);

  const createTag = useCallback(async (tagData: Omit<Tag, 'id'>) => {
    const tag: Tag = {
      ...tagData,
      id: crypto.randomUUID(),
    };
    return dbManager.create(STORES.TAGS, tag);
  }, [dbManager]);

  const getAllTags = useCallback(async () => {
    return dbManager.readAll<Tag>(STORES.TAGS);
  }, [dbManager]);

  const updateTag = useCallback(async (tag: Tag) => {
    return dbManager.update(STORES.TAGS, tag);
  }, [dbManager]);

  const deleteTag = useCallback(async (id: string) => {
    return dbManager.delete(STORES.TAGS, id);
  }, [dbManager]);

  const createCategory = useCallback(async (categoryData: Omit<Category, 'id'>) => {
    const category: Category = {
      ...categoryData,
      id: crypto.randomUUID(),
    };
    return dbManager.create(STORES.CATEGORIES, category);
  }, [dbManager]);

  const getAllCategories = useCallback(async () => {
    return dbManager.readAll<Category>(STORES.CATEGORIES);
  }, [dbManager]);

  const updateCategory = useCallback(async (category: Category) => {
    return dbManager.update(STORES.CATEGORIES, category);
  }, [dbManager]);

  const deleteCategory = useCallback(async (id: string) => {
    return dbManager.delete(STORES.CATEGORIES, id);
  }, [dbManager]);

  return {
    isInitialized,
    createUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
    createNote,
    getNote,
    getAllNotes,
    getNotesByUser,
    updateNote,
    deleteNote,
    createTag,
    getAllTags,
    updateTag,
    deleteTag,
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
  };
};