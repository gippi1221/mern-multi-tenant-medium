import { createBrowserRouter, RouterProvider } from 'react-router';
import { appPages, appRoutes } from './routes';
import MainLayout from '@/layouts/MainLayout';
import { Home, SignIn, SignUp } from '@/pages';
export const Router = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      children: [
        {
          path: appRoutes.APP_ROUTE,
          element: <MainLayout />,
          children: [
            {
              index: true,
              Component: Home,
            },
          ],
        },
        {
          path: appRoutes.AUTH_ROUTE,
          children: [
            {
              index: true,
              Component: SignIn,
            },
            {
              path: appPages.SIGN_IN_PAGE,
              Component: SignIn,
            },
            {
              path: appPages.SIGN_UP_PAGE,
              Component: SignUp,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
