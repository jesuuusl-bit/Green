import React, { createContext, useEffect } from "react";
import { io } from "socket.io-client";

// 👉 Crea el contexto
export const SocketContext = createContext();

// 👉 Conecta con tu backend-API actualizado en Render
const socket = io("https://green-1-kjes.onrender.com", {
  transports: ["websocket"],
});

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.on("connect", () => console.log("🟢 Socket conectado:", socket.id));
    socket.on("disconnect", () => console.log("🔴 Socket desconectado"));
    return () => socket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
