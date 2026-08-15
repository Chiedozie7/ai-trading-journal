import { createContext, useEffect, useState } from "react";

const PreferencesContext = createContext({});

export function PreferencesProvider({ children }) {

    const defaultPreferences = {
        appearance: {
            theme: "light",
        },
        trading: {
            defaultRisk: 1,
        },
    };

    const [preferences, setPreferences] = useState(() => {
        const saved = localStorage.getItem("preferences");

        if (!saved) return defaultPreferences;

        const parsed = JSON.parse(saved);

        return {
            appearance: {
                ...defaultPreferences.appearance,
                ...parsed.appearance,
            },
            trading: {
                ...defaultPreferences.trading,
                ...parsed.trading,
            },
        };
    });

    useEffect(() => {

        localStorage.setItem(
            "preferences",
            JSON.stringify(preferences)
        );

    }, [preferences]);

    useEffect(() => {
        const root = document.documentElement;
        const selectedTheme = preferences.appearance.theme;

        if (selectedTheme === "system") {
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

            root.setAttribute(
                "data-theme",
                prefersDark ? "dark" : "light"
            );
        } else {
            root.setAttribute("data-theme", selectedTheme);
        }
    }, [preferences.appearance.theme]);

    useEffect(() => {
        console.log(preferences);
    }, [preferences]);

    return (
        <PreferencesContext.Provider
            value={{
                preferences,
                setPreferences,
            }}
        >
            {children}
        </PreferencesContext.Provider>
    );
}

export default PreferencesContext;