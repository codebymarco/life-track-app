import { Route, RouteObject } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Entries from "../pages/Entries";
import Diet from "../pages/Diet";
import JournalEntries from "../pages/Journal";
import StatusPage from "../pages/StatusPage";
import PlacesPage from "../pages/PlacesPage";
import SkillsPage from "../pages/SkillsPage";
import PasswordsPage from "../pages/Passwords";
import Todo from "../pages/Todo";
import Links from "../pages/Links";
import VisionBoard from "../pages/VisionBoard";
import Tobuy from "../pages/ToBuy";

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
  },
  {
    path: "/places",
    element: (
      <MainLayout>
        <Route index element={<PlacesPage />} />
      </MainLayout>
    ),
  },
  {
    path: "/skills",
    element: (
      <MainLayout>
        <Route index element={<SkillsPage />} />
      </MainLayout>
    ),
  },
  {
    path: "/notes",
    element: (
      <MainLayout>
        <Route index element={<SkillsPage />} />
      </MainLayout>
    ),
  },
  {
    path: "/passwords",
    element: (
      <MainLayout>
        <Route index element={<PasswordsPage />} />
      </MainLayout>
    ),
  },
  {
    path: "/todo",
    element: (
      <MainLayout>
        <Route index element={<Todo />} />
      </MainLayout>
    ),
  },
  {
    path: "/links",
    element: (
      <MainLayout>
        <Route index element={<Links />} />
      </MainLayout>
    ),
  },
  {
    path: "/vision",
    element: (
      <MainLayout>
        <Route index element={<VisionBoard />} />
      </MainLayout>
    ),
  },
  {
    path: "/tobuy",
    element: (
      <MainLayout>
        <Route index element={<Tobuy />} />
      </MainLayout>
    ),
  }
];

export default routes;
