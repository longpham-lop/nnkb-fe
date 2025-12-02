// components/toast.jsx
import { useEffect } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io("https://nnkb-vpk7.onrender.com", {
  transports: ["websocket", "polling"],
});

function TicketNotifier() {
  useEffect(() => {
    socket.on('ticketUpdate', (data) => {
      toast.info(`Ai đó vừa mua ${data.quantitySold} vé, còn ${data.remaining} vé`, {
        position: "top-right",
        autoClose: 2000, // 2 giây
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    });

    return () => socket.off('ticketUpdate');
  }, []);

  return null;
}

export default TicketNotifier;
