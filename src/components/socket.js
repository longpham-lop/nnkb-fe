import { io } from "socket.io-client";

const socket = io("https://nnkb-vpk7.onrender.com", {
  transports: ["websocket", "polling"],
});


export default socket;