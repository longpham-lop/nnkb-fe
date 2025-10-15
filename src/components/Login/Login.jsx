import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đăng nhập</h2>
        <input type="email" placeholder="Nhập email..." />
        <input type="password" placeholder="Nhập mật khẩu..." />
        <button className="btn-login" onClick={() => navigate("/Home")}>
          Đăng nhập
        </button>
        <button className="btn-secondary">Tiếp tục</button>
        <a href="#">Quên mật khẩu?</a>
        <button
          className="btn-login"
          style={{ marginTop: '15px' }}
          onClick={() => navigate('/register')}
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
}

export default Login;
