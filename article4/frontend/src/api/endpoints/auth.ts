import type { IUser } from '@/interfaces';
import $host from '..';

export const signUp = async (email: string, password: string): Promise<IUser> => {
  const { data } = await $host.post<IUser>('/auth/signup', { email, password });
  return data;
};

export const signIn = async (email: string, password: string): Promise<IUser> => {
  const { data } = await $host.post<IUser>('/auth/signin', { email, password });
  return data;
};

export const signOut = async (): Promise<void> => {
  await $host.post('/auth/signout');
};

export const refreshToken = async (): Promise<IUser> => {
  const { data } = await $host.post('/auth/refresh-token');
  return data;
};

export const me = async (): Promise<IUser> => {
  const { data } = await $host.get<IUser>('/auth/me');
  return data;
};
