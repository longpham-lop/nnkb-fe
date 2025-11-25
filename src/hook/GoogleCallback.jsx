import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      if (!data.token) {
        navigate("/login");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log (data.token) ;

      navigate("/home");
    })
    .catch(() => navigate("/home"));
}, []);
}

export default GoogleCallback;