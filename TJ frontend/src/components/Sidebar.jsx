import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";
import {
    FiHome,
    FiBarChart2,
    FiFileText,
    FiSettings,
    FiTrendingUp,
    FiX
} from "react-icons/fi";

const navItems = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: FiHome,
    },
    {
        name: "Trades",
        path: "/trades",
        icon: FiFileText,
    },
    {
        name: "Analytics",
        path: "/analytics",
        icon: FiBarChart2,
    },
];

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
    return (
        <aside
            className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}
        >

            <div className="sidebar-brand">

                <div className="brand-header">

                    <div className="brand-left">

                        <div className="brand-icon">
                            <FiTrendingUp />
                        </div>

                        <div className="brand-content">
                            <h2>Trading Journal</h2>
                            <p className="brand-tagline">
                                Track • Review • Improve
                            </p>
                        </div>

                    </div>

                    <button
                        className="sidebar-close-btn"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <FiX />
                    </button>

                </div>

            </div>

            <nav className="sidebar-nav">

                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => {
                                if (window.innerWidth <= 1023) {
                                    setIsSidebarOpen(false);
                                }
                            }}
                        >
                            <Icon />
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}

            </nav>
        </aside>
    );
}

export default Sidebar;