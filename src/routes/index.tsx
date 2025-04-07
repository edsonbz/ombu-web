
import {
    BrowserRouter,
    Outlet,
    Route,
    Routes
} from "react-router-dom";
import LoginView from "../pages/Login/LoginView";
import HomeView from "../pages/Home/HomeView";
import { Layout } from "../components/ui/Layout";
import { ProductsView } from "@/pages/Products/ProductsView";
import { SuppliersView } from "@/pages/Suppliers/SuppliersView";
import { RestockView } from "@/pages/Restock/RestockView";
import { PurchaseInvoiceView } from "@/pages/PurchaseInvoice/PurchaseInvoiceView";


export function Routing() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginView />} />
                <Route element={<LayoutWithSidebar />}>
                    <Route path="/home" element={<HomeView />} />
                    <Route path="/products" element={<ProductsView/>} />
                    <Route path="/suppliers" element={<SuppliersView/>} />
                    <Route path="/restocks" element={<RestockView/>} />
                    <Route path="/purchases-invoice" element={<PurchaseInvoiceView/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

function LayoutWithSidebar() {
    return <Layout><Outlet /></Layout>;
}