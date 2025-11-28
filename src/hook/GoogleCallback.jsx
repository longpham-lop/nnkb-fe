import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // Thêm useSearchParams
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { jwtDecode } from "jwt-decode"; // Gợi ý: cài thêm npm install jwt-decode để lấy info từ token

const GoogleCallback = () => {
  // 1. DI CHUYỂN HOOK VÀO TRONG COMPONENT
  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 2. Lấy token trực tiếp từ URL thay vì fetch /auth/me
    const tokenFromUrl = searchParams.get("token");

    if (tokenFromUrl) {
      console.log("Token received:", tokenFromUrl);

      // Lưu vào localStorage
      localStorage.setItem("token", tokenFromUrl);
      
      // Nếu bạn muốn lấy thông tin user ngay lập tức, bạn có thể decode token
      // Hoặc gọi API get profile sau khi đã có token.
      // Ở đây mình giả sử lưu token xong là thành công:
      
      // Dispatch Redux (Tạm thời lưu token, user có thể fetch sau hoặc decode)
      // Lưu ý: Nếu user trong redux cần object user đầy đủ, bạn nên gọi API get profile bằng token vừa có
      
      dispatch(loginSuccess({ token: tokenFromUrl })); 

      // Điều hướng về trang chủ
      navigate("/home");
    } else {
      // Trường hợp fallback: Nếu không có token trên URL thì mới thử fetch cookie
      // Nhưng thường thì nếu URL không có token là lỗi rồi.
      console.error("Không tìm thấy token trên URL");
      navigate("/login?error=google_auth_failed");
    }
  }, [dispatch, navigate, searchParams]);

  return <div>Đang xử lý đăng nhập Google...</div>;
};

export default GoogleCallback;