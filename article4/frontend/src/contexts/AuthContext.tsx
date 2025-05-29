import { signIn, signOut, signUp } from '@/api';
import type { IUser } from '@/interfaces';
import { createContext, useState } from 'react';
import type { PropsWithChildren } from 'react';

export interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
  signUserIn: (email: string, password: string) => Promise<void>;
  signUserUp: (email: string, password: string) => Promise<void>;
  signUserOut: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  isAuthenticated: false,
  signUserIn: async () => {},
  signUserUp: async () => {},
  signUserOut: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signUserIn = async (email: string, password: string): Promise<void> => {
    const newUser = await signIn(email, password);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const signUserUp = async (email: string, password: string): Promise<void> => {
    const newUser = await signUp(email, password);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const signUserOut = async (): Promise<void> => {
    await signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  const state: IAuthContext = {
    user,
    isAuthenticated,
    signUserIn,
    signUserUp,
    signUserOut,
  };

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
