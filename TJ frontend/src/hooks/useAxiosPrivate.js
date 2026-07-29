import { useEffect } from "react";
import axios from "../api/axios";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
    const { auth } = useAuth();
    const refresh = useRefreshToken();

    useEffect(() => {
        const requestIntercept = axios.interceptors.request.use(
            (config) => {
                if (!config.headers.Authorization && auth?.accessToken) {
                    config.headers.Authorization = `Bearer ${auth.accessToken}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;

                if (
                    error?.response?.status === 403 &&
                    prevRequest &&
                    !prevRequest.sent
                ) {
                    prevRequest.sent = true;

                    try {
                        const newAccessToken = await refresh();

                        prevRequest.headers.Authorization =
                            `Bearer ${newAccessToken}`;

                        return axios(prevRequest);
                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestIntercept);
            axios.interceptors.response.eject(responseIntercept);
        };
    }, [auth?.accessToken]);

    return axios;
};

export default useAxiosPrivate;