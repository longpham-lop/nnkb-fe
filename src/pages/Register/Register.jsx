import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
    birthday: "",
    birthplace: "",
    gender: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState(null);

 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      return setError("Mật khẩu không khớp!");
    }

    try {
      await register({
        name: `${form.firstName} ${form.lastName}`,
        phone: form.phone,
        email: form.email,
        address: form.address,
        password: form.password,
        birthday: form.birthday,
        birthplace: form.birthplace,
        gender: form.gender
      });

      setSuccess("Đăng ký thành công!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Đăng ký</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        {/* ===== OCR CCCD Section ===== */}
        

        {/* ===== Form đăng ký ===== */}
        <form className="register-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="firstName"
            placeholder="Họ"
            value={form.firstName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="lastName"
            placeholder="Tên"
            value={form.lastName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            value={form.address}
            onChange={handleChange}
          />

          <input
            type="text"
            name="birthday"
            placeholder="Ngày sinh"
            value={form.birthday}
            onChange={handleChange}
          />

          <input
            type="text"
            name="birthplace"
            placeholder="Nơi sinh"
            value={form.birthplace}
            onChange={handleChange}
          />

          <input
            type="text"
            name="gender"
            placeholder="Giới tính"
            value={form.gender}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </form>

        <button className="btn-register" onClick={handleRegister}>
          Đăng ký
        </button>

        <div className="divider">
          <span>Hoặc đăng ký với</span>
        </div>

        <button
          className="btn-google"
          onClick={() =>
            (window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`)
          }
        >
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
