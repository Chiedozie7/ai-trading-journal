import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import "../styles/topbar.css";
import { FiMenu } from "react-icons/fi";
import Avatar from "./Avatar";


function Topbar({ isSidebarOpen, setIsSidebarOpen }) {
    const logout = useLogout();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const location = useLocation();
    const { auth } = useAuth();

    const username = auth?.user?.username || "Trader";

    const hour = new Date().getHours();
    let greeting = "Good evening";

    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 18) {
        greeting = "Good afternoon";
    }

    let page = {
        title: "Trading Journal",
        subtitle: "",
    };

    if (location.pathname === "/dashboard") {
        page = {
            title: "Dashboard",
            subtitle: `${greeting}, ${username} 👋`,
        };
    }

    else if (location.pathname === "/trades") {
        page = {
            title: "Trades",
            subtitle: "Manage and review your recorded trades.",
        };
    }

    else if (location.pathname.startsWith("/trades/")) {
        page = {
            title: "Trade Details",
            subtitle: "Review every aspect of this trade.",
        };
    }

    else if (location.pathname === "/analytics") {
        page = {
            title: "Analytics",
            subtitle: "Track your trading performance.",
        };
    }

    else if (location.pathname === "/create-trade") {
        page = {
            title: "New Trade",
            subtitle: "Record a new trade in your journal.",
        };
    }

    else if (location.pathname.startsWith("/edit-trade/")) {
        page = {
            title: "Edit Trade",
            subtitle: "Update the details of this trade.",
        };
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <header className="topbar">

            <div className="topbar-main">

                <button
                    className="menu-btn"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <FiMenu />
                </button>

                <div className="topbar-heading">

                    <h2 className="page-title">
                        {page.title}
                    </h2>

                    {page.subtitle && (
                        <p className="page-subtitle">
                            {page.subtitle}
                        </p>
                    )}

                </div>

                <div className="topbar-actions">

                    <Link
                        to="/create-trade"
                        className="add-trade-btn desktop-add-btn"
                    >
                        + Add Trade
                    </Link>

                    <div
                        className="profile-menu"
                        ref={menuRef}
                    >

                        <button
                            className="profile-btn"
                            onClick={() => setIsMenuOpen(prev => !prev)}
                        >
                            <Avatar
                                username={username}
                                size="md"
                            />
                        </button>

                        {isMenuOpen && (
                            <div className="profile-dropdown">

                                <div className="profile-info">
                                    <strong>{username}</strong>
                                    <span>{auth.user.email}</span>
                                </div>

                                <Link
                                    to="/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>

                                <Link
                                    to="/settings"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Settings
                                </Link>

                                <button onClick={handleLogout}>
                                    Logout
                                </button>

                            </div>
                        )}

                    </div>

                </div>

            </div>

            <Link
                to="/create-trade"
                className="add-trade-btn mobile-add-btn"
            >
                + Add Trade
            </Link>

        </header>
    );
}

export default Topbar;