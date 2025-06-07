import type { IBook } from '@/interfaces';
import $host from '..';

export const fetchBooks = async () => {
  const { data } = await $host.get<IBook[]>('/books');
  return data;
};

export const createBook = async (book: Partial<IBook>) => {
  const { data } = await $host.post<IBook>('/books', book);
  return data;
};

export const removeBook = async (bookId: string) => {
  const { data } = await $host.delete(`/books/${bookId}`);
  return data;
};
