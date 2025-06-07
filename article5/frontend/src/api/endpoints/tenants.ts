import type { ITenant } from '@/interfaces';
import $host from '..';

export const fetchTenant = async () => {
  const subdomain = window.location.hostname.split('.')[0];
  const { data } = await $host.get<ITenant>(`/tenants/${subdomain}`);
  return data;
};
