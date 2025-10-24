import { useState, useEffect } from "react";

export default function useAuth() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Hàm login -> lưu vào state + localStorage
  const login = (data) => {
    if (data.accessToken) {
      localStorage.setItem("token", data.accessToken);
      setToken(data.accessToken);
    }
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    }
  };

  // Hàm logout -> clear
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const pjid =(x) => {
    localStorage.setItem("pjid",JSON.stringify(x));
  };

  return { token, user, login, logout, pjid };
}
