import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client.js";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        if (!cancelled) setChecking(false);
        return;
      }
      try {
        const { ok, data } = await api.verify();
        if (cancelled) return;
        const valid = ok && data.responseStatus === "success";
        setIsAuthenticated(valid);
        setUser(valid ? data.decode || null : null);
        setChecking(false);
      } catch {
        if (cancelled) return;
        setIsAuthenticated(false);
        setUser(null);
        setChecking(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return { isAuthenticated, user, checking, logout };
};
