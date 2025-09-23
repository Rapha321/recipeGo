import { createContext, useContext, useState, useEffect } from 'react';
import api from './api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    const navigate = useNavigate();

    const checkAuth = async (token) => {
        if (!token) {
            setIsLoggedIn(false);
            setLoading(false);
            return;
        }
        try {
            const res = await api.get('/api/user/info/');
            setUser(res.data);
            setIsLoggedIn(true);
        } catch (error) {
            console.error("Error fetching user info:", error);
            localStorage.clear();
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        checkAuth(token);
    }, []);

    const login = async (accessToken) => {
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        await checkAuth(accessToken);
    };

    const logout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUser(null);
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (token) {
                await fetch('api/token/blacklist/', {
                    method: 'POST',
                    headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            logout(); 
            navigate('/login');
        }
    };

    let settings = isLoggedIn ? ['Profile', 'Logout'] : ['Login'];

    // Conditional rendering for the loading state
    if (loading) {
        return <div>Loading...</div>; 
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, handleLogout, settings }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);