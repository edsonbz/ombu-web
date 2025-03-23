import { ReactNode } from "react";
import { SidebarProvider } from "./sidebar";
import { SideBarContentView } from "../../pages/SideBar/SideBarContentView";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider className="flex h-screen">
      <SideBarContentView/>
      <main className="flex-1 p-4">
        {children}
      </main>
    </SidebarProvider>
  );
};
