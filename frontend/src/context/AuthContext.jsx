import { createContext, useContext, useState, useEffect } from "react";

// Simple JWT decoder – returns null on invalid token so app never crashes
const jwtDecode = (token) => {
    try {
        if (!token || typeof token !== "string") return null;
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

const safeGetItem = (key, fallback) => {
    try {
        return localStorage.getItem(key) || fallback;
    } catch {
        return fallback;
    }
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => safeGetItem("token", null));
    const [user, setUser] = useState(null);
    const [currentRole, setCurrentRole] = useState(() => safeGetItem("currentRole", "investor"));

    const logout = () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("currentRole");
        } catch (_) {}
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        if (!token) return;
        const decoded = jwtDecode(token);
        if (!decoded) {
            logout();
            return;
        }
        try {
            const storedUser = safeGetItem("user", null);
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                if (!safeGetItem("currentRole", null)) {
                    setCurrentRole(parsedUser.role || "investor");
                }
            } else {
                const userData = {
                    ...decoded,
                    name: decoded.name || "David Williams",
                    role: decoded.role || "investor",
                };
                setUser(userData);
                if (!safeGetItem("currentRole", null)) {
                    setCurrentRole(userData.role);
                }
            }
        } catch (err) {
            console.error("Auth: invalid stored user", err);
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