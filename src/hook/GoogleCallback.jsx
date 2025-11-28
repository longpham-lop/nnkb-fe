import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { jwtDecode } from "jwt-decode"; // Import thư viện decode

const GoogleCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");

    if (tokenFromUrl) {
      try {
        console.log("Token received:", tokenFromUrl);

        // 1. Giải mã token để lấy thông tin user
        const userDecoded = jwtDecode(tokenFromUrl);
        console.log("User info decoded:", userDecoded);

        // 2. Lưu vào LocalStorage
        localStorage.setItem("token", tokenFromUrl);
        // Quan trọng: Phải dùng JSON.stringify để tránh lỗi "undefined is not valid JSON"
        localStorage.setItem("user", JSON.stringify(userDecoded));

        // 3. Cập nhật Redux Store
        dispatch(
          loginSuccess({
            token: tokenFromUrl,
            user: userDecoded,
          })
        );

        // 4. Chuyển hướng về Home
        navigate("/home");

      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        // Nếu token sai hoặc lỗi format -> đá về login
        navigate("/login?error=invalid_token");
      }
    } else {
      console.error("Không tìm thấy token trên URL");
      navigate("/login?error=google_auth_failed");
    }
  }, [dispatch, navigate, searchParams]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h3>Đang xử lý đăng nhập Google...</h3>
    </div>
  );
};

export default GoogleCallback;