import { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const data = await apiRequest('/api/auth/me', {}, token);
                setUser(data.user);
            } catch (_error) {
                localStorage.removeItem('token');
                setToken('');
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, [token]);

    const login = (newToken, newUser) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }

    return context;
}

export { AuthProvider, useAuth };
