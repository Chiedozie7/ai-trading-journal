import { NavLink } from "react-router-dom";
import {
    FiGrid,
    FiBookOpen,
    FiPlus,
    FiBarChart2,
    FiCalendar,
} from "react-icons/fi";
import "../styles/mobileBottomNav.css";


function MobileBottomNav() {

    return (

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

            <NavLink to="/calendar">
                <FiCalendar />
                <span>Calendar</span>
            </NavLink>

        </nav>

    );

}

export default MobileBottomNav;