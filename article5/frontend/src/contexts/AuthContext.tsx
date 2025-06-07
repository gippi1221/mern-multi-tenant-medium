import { me, signIn, signOut, signUp } from '@/api';
import type { IUser } from '@/interfaces';
import { authRoutes } from '@/router/routes';
import { createContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';

export interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
  getMe: () => Promise<void>;
  signUserIn: (email: string, password: string) => Promise<void>;
  signUserUp: (email: string, password: string) => Promise<void>;
  signUserOut: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  isAuthenticated: false,
  getMe: async () => {},
  signUserIn: async () => {},
  signUserUp: async () => {},
  signUserOut: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const getMe = async (): Promise<void> => {
    try {
      const user = await me();
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const path = window.location.pathname;

    if (authRoutes.includes(path)) {
      setIsLoading(false);
      return;
    }

    getMe();
  }, []);

  if (isLoading) {
    return null;
  }

  const state: IAuthContext = {
    user,
    isAuthenticated,
    getMe,
    signUserIn,
    signUserUp,
    signUserOut,
  };

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
