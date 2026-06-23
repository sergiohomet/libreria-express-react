import { useState, useEffect, useCallback } from 'react';
import type { Book } from '../types/Book';
import type { BookFormData } from '../schemas/bookSchema';
import { getLibros, createLibro, updateLibro, deleteLibro } from '../services/api';
import axios from 'axios';

function extraerMensajeError(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.data?.error) {
    return error.response.data.error as string;
  }
  return 'Ocurrió un error inesperado';
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLibros();
      setBooks(data);
    } catch (err) {
      setError(extraerMensajeError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const addBook = async (data: BookFormData): Promise<void> => {
    try {
      await createLibro(data);
      await fetchBooks();
    } catch (err) {
      throw new Error(extraerMensajeError(err));
    }
  };

  const editBook = async (id: number, data: BookFormData): Promise<void> => {
    try {
      await updateLibro(id, data);
      await fetchBooks();
    } catch (err) {
      throw new Error(extraerMensajeError(err));
    }
  };

  const removeBook = async (id: number): Promise<void> => {
    try {
      await deleteLibro(id);
      await fetchBooks();
    } catch (err) {
      throw new Error(extraerMensajeError(err));
    }
  };

  return { books, loading, error, fetchBooks, addBook, editBook, removeBook };
}
