import { MainLayout } from "@components/layouts/MainLayout";
import { MemesPage } from "@components/pages/MemesPage";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { StatsPage } from "./components/pages/StatsPage";

const rootRoute = createRootRoute({
  component: MainLayout,
});

const statsPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: StatsPage,
});

const memesPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/memes",
  component: MemesPage,
});

const routeTree = rootRoute.addChildren([statsPage, memesPage]);

const router = createRouter({ routeTree });

export const App = () => <RouterProvider router={router} />;
