import React, { createContext, useEffect } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const socket = io(import.meta.env.VITE_SOCKET_URL, {
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
