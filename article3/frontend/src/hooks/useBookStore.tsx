import { useContext } from 'react';
import { StoresContext } from '@/contexts/StoresContext';
import type { IBookStore } from '@/stores';

export const useBookStore = (): IBookStore => {
  const { bookStore } = useContext(StoresContext);
  return bookStore;
};
