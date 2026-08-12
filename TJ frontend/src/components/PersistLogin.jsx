import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

function PersistLogin() {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                if (err.response?.status !== 401) {
                    console.error(err);
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (!auth?.accessToken) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
        }
    }, [auth?.accessToken, refresh]);

    return isLoading ? <p>Loading...</p> : <Outlet />;
}

export default PersistLogin;