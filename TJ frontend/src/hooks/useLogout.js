import useAxiosPrivate from "./useAxiosPrivate";
import useAuth from "./useAuth";

const useLogout = () => {
    const axiosPrivate = useAxiosPrivate();
    const { setAuth } = useAuth();

    const logout = async () => {
        try {
            await axiosPrivate.post(
                "/logout",
                {},
                {
                    withCredentials: true,
                }
            );
        } catch (err) {
            console.error(err);
        } finally {
            setAuth({});
        }
    };

    return logout;
};

export default useLogout;