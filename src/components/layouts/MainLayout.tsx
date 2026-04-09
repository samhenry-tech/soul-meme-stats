import { Outlet } from "@tanstack/react-router";
import { Header } from "~/components/organisms/Header";

export const MainLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);
