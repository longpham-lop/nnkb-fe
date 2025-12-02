import React, { useRef } from "react";
import emailjs from "emailjs-com";
import "./FeedbackForm.css"; 

function FeedbackForm() {
  const form = useRef();

  const sendFeedback = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      "service_p0zj6t4",
      "template_7kjamzh",
      form.current,
      "abRzbKpuWCoLbCQv9"
    )
    .then(
      () => {
        alert("Phản hồi đã được gửi thành công!");
        form.current.reset();
      },
      () => {
        alert("Gửi phản hồi thất bại, thử lại sau!");
      }
    );
  };

  return (
    <div className="feedback-container">
      <h2>Gửi phản hồi cho chúng tôi</h2>
      <form ref={form} onSubmit={sendFeedback} className="feedback-form">
        <input type="text" name="user_name" placeholder="Tên của bạn" required />
        <input type="email" name="user_email" placeholder="Email của bạn" required />
        <textarea name="message" placeholder="Nội dung phản hồi" required />
        <button type="submit">Gửi phản hồi</button>
      </form>
    </div>
  );
}

export default FeedbackForm;
