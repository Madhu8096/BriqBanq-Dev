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
    } catch (error) {
        throw new Error("Invalid Token");
    }
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [currentRole, setCurrentRole] = useState(() => {
        const storedRole = localStorage.getItem("currentRole");
        return (storedRole || "investor").toLowerCase();
    });

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);

                const storedUser = localStorage.getItem("user");
                const storedRole = localStorage.getItem("currentRole");

                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    if (storedRole) {
                        setCurrentRole(storedRole.toLowerCase());
                    } else {
                        setCurrentRole((parsedUser.role || "investor").toLowerCase());
                    }
                } else {
                    const userData = {
                        ...decoded,
                        name: decoded.name || "David Williams",
                        role: decoded.role || "investor",
                    };
                    setUser(userData);
                    const initialRole = (storedRole || userData.role || "investor").toLowerCase();
                    setCurrentRole(initialRole);
                    if (!storedRole) {
                        localStorage.setItem("currentRole", initialRole);
                    }
                }
            } catch (error) {
                console.error("Invalid Token", error);
                logout();
            }
        }
    }, [token]);

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

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("currentRole");
        setToken(null);
        setUser(null);
    };

    const switchRole = (role) => {
        const normalizedRole = role.toLowerCase();
        setCurrentRole(normalizedRole);
        localStorage.setItem("currentRole", normalizedRole);
    };

    const updateUser = (updatedData, useRoleNamespace = false) => {
        setUser((prev) => {
            if (!prev) return null;
            let newUser;
            if (useRoleNamespace) {
                const roleKey = `${currentRole.toLowerCase()}Profile`;
                newUser = {
                    ...prev,
                    [roleKey]: {
                        ...(prev?.[roleKey] || {}),
                        ...updatedData
                    }
                };
            } else {
                newUser = { ...prev, ...updatedData };
            }
            localStorage.setItem("user", JSON.stringify(newUser));
            return newUser;
        });
    };

    const getProfile = (roleOverride) => {
        if (!user) return {};
        const role = roleOverride || currentRole;
        const roleKey = `${role.toLowerCase()}Profile`;

        // Return namespaced profile, or fall back to basic user data ONLY if profile is empty
        const profileData = user[roleKey] || {};
        if (Object.keys(profileData).length === 0) {
            return {
                name: user.name,
                photo: user.photo,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            };
        }
        return profileData;
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, updateUser, currentRole, switchRole, getProfile }}>
            {children}
        </AuthContext.Provider>
    );
};