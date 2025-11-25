import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
  fetch("https://073f96edc15a.ngrok-free.app/auth/me", {
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