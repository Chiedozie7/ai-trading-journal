import axios from "../api/axios";
import useAuth from "./useAuth";
import { useCallback } from "react";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = useCallback(async () => {
        const response = await axios.get("/refresh", {
            withCredentials: true,
        });
        console.log(response.data);
        console.log("new access token:", response.data.accessToken)

        setAuth((prev) => ({
            ...prev,
            accessToken: response.data.accessToken,
            user: response.data.user,
        }));

        return response.data.accessToken;
    }, [setAuth]);

    return refresh;
};

export default useRefreshToken;