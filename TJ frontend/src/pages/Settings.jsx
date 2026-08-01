import "../styles/settings.css";
import usePreferences from "../hooks/usePreferences";
import { useNavigate } from "react-router-dom";

function Settings() {
    const { preferences, setPreferences } = usePreferences();
    const navigate = useNavigate();

    const handleThemeChange = (theme) => {
        setPreferences((prev) => ({
            ...prev,
            appearance: {
                ...prev.appearance,
                theme,
            },
        }));
    };
    return (
        <div className="settings-page">

            <h2>Settings</h2>

            <div className="settings-section">

                <h3>Account</h3>

                <button
                    className="setting-btn"
                    onClick={() => navigate("/change-password")}
                >
                    Change Password
                </button>

            </div>

            <div className="settings-section">

                <h3>Appearance</h3>

                <div className="setting-row">

                    <span>Theme</span>

                    <div className="theme-options">

                        <label>
                            <input
                                type="radio"
                                name="theme"
                                checked={preferences.appearance.theme === "system"}
                                onChange={() => handleThemeChange("system")}
                            />
                            System
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="theme"
                                checked={preferences.appearance.theme === "light"}
                                onChange={() => handleThemeChange("light")}
                            />
                            Light
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="theme"
                                checked={preferences.appearance.theme === "dark"}
                                onChange={() => handleThemeChange("dark")}
                            />
                            Dark
                        </label>

                    </div>

                </div>

            </div>

            <div className="settings-section">

                <h3>Trading</h3>

                <div className="setting-row">

                    <label htmlFor="risk">
                        Default Risk %
                    </label>

                    <input
                        id="risk"
                        type="number"
                        step="0.1"
                        min="0"
                        value={preferences.trading.defaultRisk}
                        onChange={(e) =>
                            setPreferences(prev => ({
                                ...prev,
                                trading: {
                                    ...prev.trading,
                                    defaultRisk: Number(e.target.value),
                                },
                            }))
                        }
                    />

                </div>

            </div>

            <div className="settings-section danger-zone">

                <h3>Danger Zone</h3>

                <button disabled>
                    Delete Account
                </button>

            </div>

        </div>
    );
}

export default Settings;