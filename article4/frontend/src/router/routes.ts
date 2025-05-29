const SIGN_IN_PAGE = 'sign-in';
const SIGN_UP_PAGE = 'sign-up';

const APP_ROUTE = '/';
const AUTH_ROUTE = '/auth';
const SIGN_IN_ROUTE = `${AUTH_ROUTE}/${SIGN_IN_PAGE}`;
const SIGN_UP_ROUTE = `${AUTH_ROUTE}/${SIGN_UP_PAGE}`;

export const appRoutes = {
  APP_ROUTE,
  AUTH_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
};

export const appPages = {
  SIGN_IN_PAGE,
  SIGN_UP_PAGE,
};
