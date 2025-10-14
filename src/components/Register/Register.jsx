import React from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  return (
    <div className="register-container">
      <div className="register-left">
        <h2 className="register-title">Đăng ký</h2>
        <form className="register-form">
          <input type="text" placeholder="Họ" />
          <input type="text" placeholder="Tên" />
          <input type="text" placeholder="Số điện thoại" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Mật khẩu" />
          <input type="password" placeholder="Xác nhận mật khẩu" />
        </form>
      </div>

      <div className="register-right">
        <div className="ticket-shape top"></div>

        <button className="btn-register">Đăng ký</button>

        <p className="text-account">Đã có tài khoản?</p>
        <button className="btn-login" onClick={() => navigate("/")}>
          Đăng nhập
        </button>

        <div className="ticket-shape bottom"></div>
      </div>
    </div>
  );
}

export default Register;
