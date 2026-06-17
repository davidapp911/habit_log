import { useState, useEffect } from "react";
import { getMe } from "../api/auth";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(() => !!localStorage.getItem("token"));

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        getMe()
            .then(setUser)
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setLoading(false));
    }, []);

    function login(token) {
        localStorage.setItem("token", token);
        return getMe().then(setUser);
    }

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    return { user, loading, login, logout, isAuthenticated: !!user };
}