import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import Cookies from "js-cookie"; // import Cookies library to manage cookies
import { axiosInstance } from "../config/globals";

export default function LogoutPage() {
    const { user, setUser } = useAuth(); // read user from context :contentReference[oaicite:3]{index=3}
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            setUser(null);
            axiosInstance.post('/api/logout/').then(() => {
                console.log('Logged out successfully');
                localStorage.removeItem('access_token'); // remove access token from local storage
                Cookies.remove('sessionid'); // remove session cookie
                navigate('/login', { replace: true }); // redirect to login page
                // clear user state in context
            }).catch(err => {
                console.error('Logout error:', err); // log out error message
            });

        } else {
            navigate('/login', { replace: true }); // redirect to login page if user is not authenticated
        }
    }, [user, navigate, location.pathname, setUser]); // add location.pathname to dependencies

    return null; // no UI to render for logout page
}