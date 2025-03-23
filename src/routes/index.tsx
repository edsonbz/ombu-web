
import {
    BrowserRouter,
    Outlet,
    Route,
    Routes
} from "react-router-dom";
import LoginView from "../pages/Login/LoginView";
import HomeView from "../pages/Home/HomeView";
import { Layout } from "../components/ui/Layout";


export function Routing() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginView />} />
                <Route element={<LayoutWithSidebar />}>
                    <Route path="/home" element={<HomeView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

function LayoutWithSidebar() {
    return <Layout><Outlet /></Layout>;
}