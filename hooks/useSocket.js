"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketServerURL =
      process.env.NEXT_PUBLIC_SOCKET_SERVER || "http://localhost:5000";
    const newSocket = io(socketServerURL, {
      autoConnect: true,
      transports: ["websocket"],
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
}
