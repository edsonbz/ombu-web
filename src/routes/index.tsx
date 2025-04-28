import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LoginView from "../pages/Login/LoginView";
import HomeView from "../pages/Home/HomeView";
import ProtectedRoute from "./ProtectedRoute";
import { ProductsView } from "@/pages/Products/ProductsView";
import { SuppliersView } from "@/pages/Suppliers/SuppliersView";
import { RestockView } from "@/pages/Restock/RestockView";
import { PurchaseInvoiceView } from "@/pages/PurchaseInvoice/PurchaseInvoiceView";
import { Layout } from "@/components/ui/Layout";
import { ClientsView } from "@/pages/Clients/ClientsView";
import { SalesView } from "@/pages/Sales/SalesView";
import { SettingsView } from "@/pages/Settings/SettingsView";
import { ReportsView } from "@/pages/Reports/ReportsView";


export function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginView />} />
        
        <Route element={<ProtectedRoute><LayoutWithSidebar /></ProtectedRoute>}>
          <Route path="/home" element={<HomeView />} />
          <Route path="/products" element={<ProductsView />} />
          <Route path="/suppliers" element={<SuppliersView />} />
          <Route path="/restocks" element={<RestockView />} />
          <Route path="/purchases-invoice" element={<PurchaseInvoiceView />} />
          <Route path="/clients" element={<ClientsView />} />
          <Route path="/sales" element={<SalesView />} />
          <Route path="/settings" element={<SettingsView/>} />
          <Route path="/reports" element={<ReportsView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function LayoutWithSidebar() {
  return <Layout><Outlet /></Layout>;
}
