import { fetchTenant } from '@/api';
import { TenantNotFound } from '@/pages';
import { Spin } from 'antd';
import { useEffect, useState, type PropsWithChildren } from 'react';

const TenantWrapper = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await fetchTenant();
        setIsLoading(false);
      } catch {
        setError('Failed to initialize the app');
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <Spin fullscreen />;
  }

  if (error) {
    return <TenantNotFound />;
  }

  return <>{children}</>;
};

export default TenantWrapper;
