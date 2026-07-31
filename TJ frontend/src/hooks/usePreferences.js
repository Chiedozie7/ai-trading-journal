import { useContext } from "react";
import PreferencesContext from "../context/PreferencesProvider";

const usePreferences = () => {
    return useContext(PreferencesContext);
};

export default usePreferences;