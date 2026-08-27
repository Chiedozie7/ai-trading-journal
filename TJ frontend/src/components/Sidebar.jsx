import { useContext } from "react";
import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";
import PreferencesContext from "../context/PreferencesProvider";
import {
    FiHome,
    FiBarChart2,
    FiFileText,
    FiCalendar,
    FiTarget,
    FiEdit3,
    FiSettings,
    FiX,
    FiMoon,
    FiSun
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
    {
        name: "Calendar",
        path: "/calendar",
        icon: FiCalendar,
    },
    {
        name: "Goals",
        path: "/goals",
        icon: FiTarget,
    },
    {
        name: "Notes",
        path: "/notes",
        icon: FiEdit3,
    },
    {
        name: "Settings",
        path: "/settings",
        icon: FiSettings,
    },
];

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {

    const { preferences, setPreferences } =
        useContext(PreferencesContext);

    const isDarkMode =
        preferences.appearance.theme === "dark";

    const handleThemeToggle = () => {
        setPreferences((prev) => ({
            ...prev,
            appearance: {
                ...prev.appearance,
                theme: isDarkMode ? "light" : "dark",
            },
        }));
    };
    return (
        <aside
            className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}
        >

            <div className="sidebar-brand">

                <div className="brand-header">

                    <div className="brand-left">

                        <img
                            src="/images/tradeledger-logo.png"
                            alt="TradeLedger"
                            className="brand-logo"
                        />

                        <div className="brand-content">
                            <h2>
                                Trade<span>Ledger</span>
                            </h2>

                            <p className="brand-tagline">
                                Review • Refine • Repeat
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

            <div className="sidebar-theme">
                <button
                    type="button"
                    className="sidebar-theme-btn"
                    onClick={handleThemeToggle}
                >
                    {isDarkMode ? <FiSun /> : <FiMoon />}

                    <span>
                        {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;