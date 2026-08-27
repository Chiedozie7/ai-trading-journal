import { NavLink, useLocation } from "react-router-dom";
import {
    FiGrid,
    FiBookOpen,
    FiPlus,
    FiBarChart2,
    FiCalendar,
    FiTarget,
    FiEdit3,
    FiSettings,
    FiMoreHorizontal,
    FiChevronDown,
} from "react-icons/fi";
import { useState } from "react";
import "../styles/mobileBottomNav.css";

function MobileBottomNav() {
    const location = useLocation();
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    const secondaryItems = [
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

    const activeSecondary =
        secondaryItems.find(
            (item) =>
                location.pathname === item.path
        );

    const MoreIcon = activeSecondary
        ? activeSecondary.icon
        : FiMoreHorizontal;

    const moreLabel = activeSecondary
        ? activeSecondary.name
        : "More";

    const handleMoreClick = () => {
        setIsMoreOpen((prev) => !prev);
    };

    return (
        <>
            {isMoreOpen && (
                <div
                    className="mobile-more-backdrop"
                    onClick={() => setIsMoreOpen(false)}
                />
            )}

            {isMoreOpen && (
                <div className="mobile-more-menu">

                    <div className="mobile-more-menu-header">
                        <span>More</span>

                        <button
                            onClick={() =>
                                setIsMoreOpen(false)
                            }
                        >
                            ×
                        </button>
                    </div>

                    <div className="mobile-more-items">

                        {secondaryItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() =>
                                        setIsMoreOpen(false)
                                    }
                                    className={({ isActive }) =>
                                        isActive
                                            ? "more-item active"
                                            : "more-item"
                                    }
                                >
                                    <Icon />
                                    <span>
                                        {item.name}
                                    </span>
                                </NavLink>
                            );
                        })}

                    </div>

                </div>
            )}

            <nav className="mobile-bottom-nav">

                <NavLink to="/dashboard">
                    <FiGrid />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/trades">
                    <FiBookOpen />
                    <span>Trades</span>
                </NavLink>

                <NavLink
                    to="/create-trade"
                    className="add-trade-btn"
                >
                    <div className="add-trade-icon">
                        <FiPlus />
                    </div>

                    <span>Add</span>
                </NavLink>

                <NavLink to="/analytics">
                    <FiBarChart2 />
                    <span>Analytics</span>
                </NavLink>

                <button
                    type="button"
                    className={`mobile-more-trigger ${
                        activeSecondary
                            ? "secondary-active"
                            : ""
                    }`}
                    onClick={handleMoreClick}
                >
                    <MoreIcon />

                    <span>{moreLabel}</span>

                    <FiChevronDown
                        className={`more-chevron ${
                            isMoreOpen ? "open" : ""
                        }`}
                    />
                </button>

            </nav>
        </>
    );
}

export default MobileBottomNav;