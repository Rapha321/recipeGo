import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect} from "react";

function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null)

    // Check authorization status on mount
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, [])

    // Refresh the access token
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
            setIsAuthorized(false);
            return;
        }

        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }   
        } catch (error) {
            console.log(error)
            setIsAuthorized(false);
        }
    }

    // Check if the user is authenticated
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000
        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>
    } 

    // Render the protected route or redirect to login
    return isAuthorized ? children : <Navigate to="/login" />;

}

export default ProtectedRoute;