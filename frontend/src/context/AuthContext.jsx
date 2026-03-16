import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

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

        const fetchProfile = async () => {
            try {
                // Try fetching from localStorage first for immediate UI
                const storedUser = safeGetItem("user", null);
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }

                // Fetch fresh profile from backend
                const response = await api.get("/api/v1/identity/me");
                const userData = response.data;
                
                // Normalize for UI compatibility
                const normalizedUser = {
                    ...userData,
                    first_name: userData.first_name || userData.name?.split(' ')[0] || "User",
                    last_name: userData.last_name || userData.name?.split(' ').slice(1).join(' ') || "",
                    name: userData.name || (userData.first_name ? `${userData.first_name} ${userData.last_name}` : "User"),
                    role: userData.role || userData.user_roles?.[0]?.role_type || "Borrower"
                };

                setUser(normalizedUser);
                localStorage.setItem("user", JSON.stringify(normalizedUser));
                
                if (!safeGetItem("currentRole", null)) {
                    setCurrentRole(normalizedUser.role);
                    localStorage.setItem("currentRole", normalizedUser.role);
                }
            } catch (err) {
                console.error("Auth: failed to fetch profile", err);
                // If it's a 401, logout
                if (err.response?.status === 401) {
                    logout();
                }
            }
        };

        fetchProfile();
    }, [token]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const login = (newToken, userData) => {
        const normalizedUser = userData ? {
            ...userData,
            first_name: userData.first_name || userData.name?.split(' ')[0] || "User",
            last_name: userData.last_name || userData.name?.split(' ').slice(1).join(' ') || "",
            name: userData.name || (userData.first_name ? `${userData.first_name} ${userData.last_name}` : "User"),
            role: userData.role || userData.roles?.[0]?.role_type || "Borrower"
        } : null;

        // Atomic storage update
        localStorage.setItem("token", newToken);
        if (normalizedUser) {
            localStorage.setItem("user", JSON.stringify(normalizedUser));
            localStorage.setItem("currentRole", normalizedUser.role);
        }

        // Atomic state update
        setToken(newToken);
        if (normalizedUser) {
            setUser(normalizedUser);
            setCurrentRole(normalizedUser.role);
        }
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