import { useContext } from 'react';
import { AuthContext } from '@/contexts';
import type { IAuthContext } from '@/contexts';

export const useAuth = (): IAuthContext => {
  return useContext(AuthContext);
};
