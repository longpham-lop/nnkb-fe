// PaymentPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PayTicket.css";
import Voucher from "../../components/Voucher/Voucher.jsx";
import { ethers } from "ethers";
import { generateNFTTicket } from "../../utils/NFTGenerator";

import VnPay from "../../assets/vnpay.png";
import ShopeePay from "../../assets/shoppe.png";
import ZaloPay from "../../assets/zalopay.png";
import Card from "../../assets/card.png";

const formatCurrency = (amount) => {
  if (amount < 0)
    return (
      "-" +
      new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
        Math.abs(amount)
      )
    );
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );
};

/* --- Simple PageHeader (bạn có thể thay bằng component riêng nếu muốn) --- */
function PageHeader() {
  return (
    <header className="payment-header">
      <h2>Thanh toán vé</h2>
    </header>
  );
}

/* --- CountdownTimer giữ nguyên logic của bạn --- */
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="countdown-timer">
      Hoàn tất đặt vé trong
      <div className="timer-box">
        <span>{String(minutes).padStart(2, "0")}</span> :{" "}
        <span>{String(seconds).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

/* ----------------------- PaymentPage (full) ----------------------- */
function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { summary, formData } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { discountAmount, finalTotalPrice } = useMemo(() => {
    const basePrice = summary?.totalPrice || 0;
    const discount = appliedVoucher?.discount || 0;
    return { discountAmount: discount, finalTotalPrice: basePrice - discount };
  }, [summary, appliedVoucher]);

  useEffect(() => {
    if (!summary || !formData) navigate("/");
  }, [summary, formData, navigate]);

  /* --- Detect account/network change (good UX) --- */
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts && accounts.length > 0) setWalletAddress(accounts[0]);
      else setWalletAddress(null);
    };

        try {
      window.ethereum.on && window.ethereum.on("accountsChanged", handleAccountsChanged);
    } catch {
      // ignore
    }
    return () => {
      try {
        window.ethereum.removeListener &&
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      } catch {
        // ignore
      }
    };
  },
  []);

  /* --- Kết nối MetaMask --- */
  const connectWallet = async () => {
    navigate('/block-lo')
  };


  /* --- Hàm xử lý thanh toán (MetaMask) --- */
  const handlePayment = async () => {
    if (!summary || !formData) {
      alert("Thông tin đơn hàng không hợp lệ.");
      return;
    }

    // Non-blockchain paths
    if (paymentMethod !== "metamask") {
      navigate("/pay", {
        state: {
          summary: { ...summary, totalPrice: finalTotalPrice, discount: discountAmount },
          formData,
          paymentMethod,
        },
      });
      return;
    }

    // MetaMask path
    if (!walletAddress) {
      alert("Vui lòng kết nối MetaMask trước khi thanh toán!");
      return;
    }

    setIsProcessing(true);
    try {
      // --- Provider & signer (ethers v6 style) ---
      // Nếu bạn dùng ethers v5, thay đổi tương ứng.
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // TODO: Thay giá trị này bằng quy đổi VND -> ETH từ backend/oracle nếu cần chính xác.
      // Hiện để test dùng giá cố định
      const ethAmount = "0.0001"; // ví dụ: 0.0001 ETH, hãy điều chỉnh trước khi demo/đi thi

      // Gửi giao dịch thanh toán on-chain
      const tx = await signer.sendTransaction({
        to: "0xd74f3c71a7997e51afc2b5ee21e2700b0f3e93a2", // đổi thành địa chỉ thu tiền của bạn (testnet)
        value: ethers.parseEther(String(ethAmount)),
        // gasLimit có thể để provider tự ước lượng; nếu gặp lỗi, thử thêm gasLimit
      });

      // Thông báo cho người dùng
      alert("Đã gửi giao dịch. Đang chờ xác nhận trên blockchain...");
      // Chờ tx mined
      const _RECEIPT = await tx.wait();
      // receipt.transactionHash hoặc tx.hash

      // --- TẠO NFT (thuần FE) ---
      // generateNFTTicket phải là hàm của bạn (trả về object metadata/tokenId/...) .
      // Ở đây chúng ta lưu NFT "phát hành" cục bộ cùng txHash để minh chứng.
      const nft = await generateNFTTicket({
        eventName: summary.eventDetails.title,
        buyer: formData.email,
        quantity: summary.ticketsInCart.reduce((a, b) => a + b.quantity, 0),
        txHash: tx.hash,
        wallet: walletAddress,
        mintedAt: new Date().toISOString(),
      });

      // Lưu vào localStorage (client-side)
      const oldTickets = JSON.parse(localStorage.getItem("nftTickets") || "[]");
      localStorage.setItem("nftTickets", JSON.stringify([...oldTickets, nft]));

      alert(`Thanh toán & tạo NFT vé thành công!\nTX: ${tx.hash}`);
      navigate("/mytickets");
    } catch (err) {
      console.error("handlePayment error:", err);
      // nếu user reject, err.code có thể là 4001
      if (err?.code === 4001) {
        alert("Bạn đã hủy giao dịch.");
      } else {
        alert("Giao dịch thất bại. Kiểm tra console để biết chi tiết.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!summary || !formData) return null;

  const { eventDetails, ticketsInCart } = summary;
  const originalTotalPrice = summary.totalPrice;

  return (
    <div className="payment-page">
      <PageHeader />
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Trở về
      </button>

      <section className="event-banner">
        <div className="event-banner-info">
          <h3>{eventDetails.title}</h3>
          <p>🕒 14:00 - 17:00, 02 Tháng 11, 2025</p>
          <p>📍 {eventDetails.location}</p>
        </div>
        <CountdownTimer />
      </section>

      <div className="payment-page-container">
        <main className="main-payment-content">
          <h3>THANH TOÁN</h3>

          <div className="info-section">
            <h4>Thông tin nhận vé</h4>
            <p>
              Vé điện tử sẽ được gửi đến email: <strong>{formData.email}</strong>
            </p>
            <p style={{ marginTop: 6, color: "#555" }}>
              Nếu chọn MetaMask, NFT vé sẽ được tạo và liên kết với ví:{" "}
              <strong>{walletAddress ? walletAddress : formData.email}</strong>
            </p>
          </div>

          <div className="info-section">
            <div className="section-header">
              <h4>Mã khuyến mãi</h4>
              <button className="voucher-btn" onClick={() => setIsModalOpen(true)}>
                Chọn voucher
              </button>
            </div>
            {appliedVoucher ? (
              <div className="applied-voucher">
                <span className="voucher-name">{appliedVoucher.name}</span>
                <span className="voucher-discount">
                  -{formatCurrency(appliedVoucher.discount)}
                </span>
                <button className="remove-voucher-btn" onClick={() => setAppliedVoucher(null)}>
                  ×
                </button>
              </div>
            ) : (
              <p className="voucher-text" onClick={() => setIsModalOpen(true)}>
                + Thêm khuyến mãi
              </p>
            )}
          </div>

          <div className="info-section">
            <h4>Phương thức thanh toán</h4>
            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="vnpay"
                  checked={paymentMethod === "vnpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>VNPAY/Ứng dụng ngân hàng</span>
                <div className="logos">
                  <img src={VnPay} alt="VNPAY" />
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="shopeepay"
                  checked={paymentMethod === "shopeepay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>ShopeePay</span>
                <div className="logos">
                  <img src={ShopeePay} alt="ShopeePay" />
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="zalopay"
                  checked={paymentMethod === "zalopay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>ZaloPay</span>
                <div className="logos">
                  <img src={ZaloPay} alt="ZaloPay" />
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Thẻ ghi nợ/Thẻ tín dụng</span>
                <div className="logos">
                  <img src={Card} alt="Card" />
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="metamask"
                  checked={paymentMethod === "metamask"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>MetaMask (Blockchain)</span>
                <div className="logos">
                  <img
                    src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                    alt="MetaMask"
                    style={{ width: "45px", marginRight: "10px" }}
                  />
                  {!walletAddress && (
                    <button className="connect-wallet-btn" onClick={connectWallet}>
                      Kết nối ví
                    </button>
                  )}
                  {walletAddress && (
                    <span>
                      Đã kết nối: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  )}
                </div>
              </label>
            </div>
          </div>
        </main>

        <aside className="payment-sidebar">
          <div className="payment-summary-card">
            <div className="summary-header">
              <span>Thông tin đặt vé</span>
              <span className="change-ticket" onClick={() => navigate("/select-ticket")}>
                Chọn lại vé
              </span>
            </div>

            <div className="summary-section tickets">
              <div className="ticket-header">
                <span>Loại vé</span>
                <span>Số lượng</span>
              </div>

              {ticketsInCart.map((ticket) => (
                <div className="ticket-item-row" key={ticket.id}>
                  <span>{ticket.name}</span>
                  <span>{String(ticket.quantity).padStart(2, "0")}</span>
                </div>
              ))}
            </div>

            <div className="summary-section order">
              <h4>Thông tin đơn hàng</h4>
              <div className="order-row">
                <span>Tạm tính</span>
                <span>{formatCurrency(originalTotalPrice)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="order-row discount">
                  <span>Khuyến mãi</span>
                  <span className="discount-amount">{formatCurrency(-discountAmount)}</span>
                </div>
              )}
              <div className="order-row total">
                <span>Tổng tiền</span>
                <span>{formatCurrency(finalTotalPrice)}</span>
              </div>
            </div>

            <p className="legal-text">
              Bằng việc tiếp tục thanh toán, bạn đã đọc và đồng ý với các{" "}
              <a href="#">Điều khoản Dịch vụ</a>
            </p>

            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={isProcessing}
              style={{ opacity: isProcessing ? 0.7 : 1 }}
            >
              {isProcessing ? "Đang xử lý..." : paymentMethod === "metamask" ? "Thanh toán & Mint NFT" : "Thanh toán"}
            </button>
          </div>
        </aside>
      </div>

      {isModalOpen && (
        <Voucher
          onClose={() => setIsModalOpen(false)}
          onApply={(voucher) => {
            setAppliedVoucher(voucher);
            setIsModalOpen(false);
          }}
          currentOrderTotal={originalTotalPrice}
        />
      )}
    </div>
  );
}

export default PaymentPage;
