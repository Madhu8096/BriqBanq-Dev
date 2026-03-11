import { useState } from "react";
import * as authService from "../services/authService";
import * as userService from "../services/userService";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loginUser = async (credentials) => {
        try {
            setLoading(true);
            const res = await authService.login(credentials);
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }
            return res.data;
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async () => {
        try {
            setLoading(true);
            const res = await userService.getCurrentUser();
            return res.data;
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return { loginUser, fetchUser, loading, error };
};
