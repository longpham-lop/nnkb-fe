import React from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Đăng ký</h2>

        <form className="register-form">
          <input type="text" placeholder="Họ" />
          <input type="text" placeholder="Tên" />
          <input type="text" placeholder="Số điện thoại" />
          <input type="email" placeholder="Email" />
          <input type="text" placeholder="Địa chỉ" />
          <input type="password" placeholder="Mật khẩu" />
          <input type="password" placeholder="Xác nhận mật khẩu" />
        </form>

        <button className="btn-register">Đăng ký</button>

        <div className="divider">
          <span>Hoặc đăng ký với</span>
        </div>

        <button className="btn-google">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />
        </button>

        <p className="text-account">
          Đã có tài khoản?{" "}
          <span className="link-login" onClick={() => navigate("/")}>
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
