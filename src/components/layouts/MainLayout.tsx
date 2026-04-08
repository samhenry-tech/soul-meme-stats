import { Header } from "@components/organisms/Header";
import { Outlet } from "@tanstack/react-router";

export const MainLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);
