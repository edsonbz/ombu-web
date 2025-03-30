import NavBarContentView from "@/pages/Navbar/NavBarContentView";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBarContentView />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};
