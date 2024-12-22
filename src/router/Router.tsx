import { Route, RouteObject } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Entries from "../pages/Entries";
import Diet from "../pages/Diet";

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <MainLayout>
        <Route index element={<Home />} />
      </MainLayout>
    ),
  },
  {
    path: "/entries",
    element: (
      <MainLayout>
        <Route index element={<Entries />} />
      </MainLayout>
    ),
  },
  {
    path: "/diet",
    element: (
      <MainLayout>
        <Route index element={<Diet />} />
      </MainLayout>
    ),
  },
];

export default routes;
