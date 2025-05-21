import type { PropsWithChildren } from 'react';
import { createContext } from 'react';
import { bookStore } from '@/stores';
import type { IBookStore } from '@/stores';


interface IStoresContext {
  bookStore: IBookStore;
}

export const StoresContext = createContext<IStoresContext>({
  bookStore: bookStore,
});

export const StoresProvider = ({ children }: PropsWithChildren) => {
  return (
    <StoresContext.Provider
      value={{
        bookStore: bookStore,
      }}
    >
      {children}
    </StoresContext.Provider>
  );
};
