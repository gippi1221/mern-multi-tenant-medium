import { createBrowserRouter, RouterProvider } from 'react-router';
import { appPages, appRoutes } from './routes';
import MainLayout from '@/layouts/MainLayout';
import { Home, SignIn, SignUp } from '@/pages';
import { useBookStore } from '@/hooks';

export const Router = () => {
  const { getBooks } = useBookStore();

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
              loader: async () => {
                getBooks();
                return null;
              },
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
