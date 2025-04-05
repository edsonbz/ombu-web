
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


export function Routing() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginView />} />
                <Route element={<LayoutWithSidebar />}>
                    <Route path="/home" element={<HomeView />} />
                    <Route path="/products" element={<ProductsView/>} />
                    <Route path="/suppliers" element={<SuppliersView/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

function LayoutWithSidebar() {
    return <Layout><Outlet /></Layout>;
}