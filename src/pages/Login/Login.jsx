import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { login } from "../../api/auth";
import "./Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Sending:", { email, password });
      const { data } = await login({ email, password });
      await login({ email, password }); 
      setTimeout(() => {
        console.log("Chạy sau 3 giây");
      }, 3000);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home"); 
    } catch (err) {
      setError(err.response?.data?.message || "Sai thông tin đăng nhập");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Đăng nhập</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="input-group">
          <FaEnvelope className="icon" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập địa chỉ email" />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
          />
          <span
            className="toggle-pass"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <div className="options">
          <label>
            <input type="checkbox" /> Tự động đăng nhập
          </label>
          <a href="#">Quên mật khẩu?</a>
        </div>

        <button className="btn-login" onClick={handleLogin}>
          Đăng nhập
        </button>

        <div className="divider">
          <span>Hoặc đăng nhập với</span>
        </div>

        <button className="btn-google" onClick={() => window.location.href = "https://nnkb-fe-iota.vercel.app/auth/google" }>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />
        </button>

        <p className="signup-text">
          Bạn chưa có tài khoản?{" "}
          <span onClick={() => navigate("/register")}>Đăng ký ngay</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
