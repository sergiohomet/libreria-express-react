import axios from 'axios';
import type { Book } from '../types/Book';
import type { BookFormData } from '../schemas/bookSchema';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/libros',
  headers: {
    'x-api-key': import.meta.env.VITE_API_KEY,
  },
});

export const getLibros = (): Promise<Book[]> =>
  api.get<Book[]>('/').then(r => r.data);

export const getLibro = (id: number): Promise<Book> =>
  api.get<Book>(`/${id}`).then(r => r.data);

export const createLibro = (data: BookFormData): Promise<Book> =>
  api.post<Book>('/', data).then(r => r.data);

export const updateLibro = (id: number, data: BookFormData): Promise<Book> =>
  api.put<Book>(`/${id}`, data).then(r => r.data);

export const deleteLibro = (id: number): Promise<Book> =>
  api.delete<Book>(`/${id}`).then(r => r.data);
