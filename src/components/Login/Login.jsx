import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Đăng nhập</h2>

        <div className="input-group">
          <FaEnvelope className="icon" />
          <input type="email" placeholder="Nhập địa chỉ email" />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input
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

        <button className="btn-login" onClick={() => navigate("/home")}>
          Đăng nhập
        </button>

        <div className="divider">
          <span>Hoặc đăng nhập với</span>
        </div>

        <button className="btn-google">
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
