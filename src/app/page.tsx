"use client";

import { io, Socket } from "socket.io-client";
import { useRef, useState } from "react";

export default function Home() {
  const socketRef = useRef<Socket | null>(null);

  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Disconnected");

  const connectAsUser = () => {
    const socket = io("http://localhost:8080", {
      auth: {
        userId: 1,
        role: "user",
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      setStatus("Connected as User");
    });
  };

  const connectAsAdmin = () => {
    const socket = io("http://localhost:8080", {
      auth: {
        userId: 2,
        role: "admin",
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      setStatus("Connected as Admin");
    });
  };

  const sendMessage = () => {
    const socket = socketRef.current;

    if (!socket) return;

    socket.emit("message:send", {
      content: input,
    });

    setInput("");
  };

  return (
    <main>
      <h1>Phase 4</h1>

      <p>{status}</p>

      <button onClick={connectAsUser}>Connect as User</button>

      <button onClick={connectAsAdmin}>Connect as Admin</button>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />

      <button onClick={sendMessage}>Send</button>

    </main>
  );
}
