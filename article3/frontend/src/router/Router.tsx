import { createBrowserRouter, RouterProvider } from "react-router"
import { appRoutes } from "./routes";
import MainLayout from "@/layouts/MainLayout";
import { Home } from "@/pages";
import { useBookStore } from "@/hooks";

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
          ]
        }
      ]
    },
  ]);

  return <RouterProvider router={router} />;
}