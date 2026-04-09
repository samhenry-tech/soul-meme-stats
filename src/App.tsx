import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { MainLayout } from "~/components/layouts/MainLayout";
import { AllMessagesPage } from "~/components/pages/AllMemesPage";
import { MemesPage } from "~/components/pages/MemesPage";
import { StatsPage } from "~/components/pages/StatsPage";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";

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

const allMemesPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/all-memes",
  component: AllMessagesPage,
});

const routeTree = rootRoute.addChildren([statsPage, memesPage, allMemesPage]);

const router = createRouter({ routeTree });

export const App = () => (
  <SkeletonTheme baseColor="#171d20" highlightColor="#2f363a">
    <RouterProvider router={router} />
  </SkeletonTheme>
);
