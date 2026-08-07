import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileBottomNav from "./MobileBottomNav";
import "../styles/layout.css";

function Layout() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="app-layout">

            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <main className="main-content">

                <Topbar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <div className="page-content">
                    <Outlet />
                </div>

            </main>
            <MobileBottomNav />

        </div>
    );
}

export default Layout;