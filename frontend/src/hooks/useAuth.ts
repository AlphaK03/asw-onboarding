import { useState, useEffect } from "react";

export function useAuth() {
    const [role, setRole] = useState<string | null>(() => {
        return localStorage.getItem("role");
    });

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) return false;

            const data = await response.json();
            const userRole = data.roles[0]?.name.toLowerCase();

            if (userRole === "admin" || userRole === "employee") {
                localStorage.setItem("role", userRole);
                setRole(userRole);
                return true;
            }

            return false;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("role");
        setRole(null);
    };

    return { role, login, logout };
}
