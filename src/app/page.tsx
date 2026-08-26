"use client";

import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080";

function removeSocketListeners(socket: Socket) {
  socket.off("connect");
  socket.off("message:new");
  socket.off("disconnect");
}

function closeSocket(socket: Socket) {
  removeSocketListeners(socket);
  socket.disconnect();
}

export default function Home() {
  const socketRef = useRef<Socket | null>(null);

  const [messages, setMessages] = useState<Array<string>>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    return () => {
      const socket = socketRef.current;

      if (socket) {
        closeSocket(socket);
        socketRef.current = null;
      }
    };
  }, []);

  const connect = () => {
    const existingSocket = socketRef.current;

    if (existingSocket) {
      if (!existingSocket.connected) {
        existingSocket.connect();
      }

      return;
    }

    const socket = io(SOCKET_URL);

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log("Connected:", socket.id);
      setStatus("Connected");
    })

    socket.on("message:new", (data: { content: string }) => {
      console.log("Received:", data);
      setMessages((prev) => [...prev, data.content]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");

      removeSocketListeners(socket);
      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      setStatus("Disconnected");
    });
  };

  const sendMessage = () => {
    const socket = socketRef.current;

    if (!socket?.connected) return;

    if (!input.trim()) return;

    socket.emit("message:send", {
      content: input,
    });

    setInput("");
  };

  const disconnect = () => {
    const socket = socketRef.current;

    if (!socket) return;

    closeSocket(socket);
    socketRef.current = null;
    setStatus("Disconnected");
  };

  return (
      <main>
        <h1>Socket.IO Demo</h1>

        <p>Status: {status}</p>

        <Button onClick={connect}>
          Connect
        </Button>

        <Button onClick={disconnect}>
          Disconnect
        </Button>

        <hr />

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message"
        />

        <Button onClick={sendMessage}>
          Send
        </Button>

        <hr />

        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </main>
    );
}
