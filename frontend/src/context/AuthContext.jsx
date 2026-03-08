import { createContext, useContext, useState, useEffect } from "react";

// Simple JWT decoder to avoid dependency
const jwtDecode = (token) => {
    try {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch {
        throw new Error("Invalid Token");
    }
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState(null);
    const [currentRole, setCurrentRole] = useState(localStorage.getItem("currentRole") || "investor");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("currentRole");
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        if (!token) return;
        try {
            const decoded = jwtDecode(token);
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                if (!localStorage.getItem("currentRole")) {
                    setCurrentRole(parsedUser.role || "investor");
                }
            } else {
                const userData = {
                    ...decoded,
                    name: decoded.name || "David Williams",
                    role: decoded.role || "investor",
                };
                setUser(userData);
                if (!localStorage.getItem("currentRole")) {
                    setCurrentRole(userData.role);
                }
            }
        } catch (err) {
            console.error("Invalid Token", err);
            logout();
        }
    }, [token]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const login = (newToken, userData) => {
        localStorage.setItem("token", newToken);
        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("currentRole", userData.role || "investor");
            setUser(userData);
            setCurrentRole(userData.role || "investor");
        }
        setToken(newToken);
    };

    const switchRole = (role) => {
        setCurrentRole(role);
        localStorage.setItem("currentRole", role);
    };

    const updateUser = (updatedData) => {
        setUser((prev) => {
            const newUser = { ...prev, ...updatedData };
            localStorage.setItem("user", JSON.stringify(newUser));
            return newUser;
        });
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, updateUser, currentRole, switchRole }}>
            {children}
        </AuthContext.Provider>
    );
};