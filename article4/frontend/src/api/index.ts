import axios from 'axios';

const getBaseURL = (): string => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = 5050;
  return `${protocol}//${hostname}:${port}/api`;
};

const $host = axios.create({
  baseURL: getBaseURL(),
  timeout: 5000,
});

export default $host;
export * from './endpoints/books';
export * from './endpoints/auth';
