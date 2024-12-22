import { Route, RouteObject } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Entries from "../pages/Entries";
import Diet from "../pages/Diet";
import JournalEntries from "../pages/Journal";
import StatusPage from "../pages/StatusPage";

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
  {
    path: "/journal",
    element: (
      <MainLayout>
        <Route index element={<JournalEntries />} />
      </MainLayout>
    ),
  },
  {
    path: "/status",
    element: (
      <MainLayout>
        <Route index element={<StatusPage />} />
      </MainLayout>
    ),
  }
];

export default routes;
