"use client";

import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

export default function Home() {
  const socketRef = useRef<Socket | null>(null);

  const [messages, setMessages] = useState<Array<string>>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Disconnected");

  const connect = () => {
    const socket = io("http://localhost:8080");

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log("Connected:", socket.id);
      setStatus("Connected");
    })

    socket.on("message:new", (data) => {
      console.log("Received:", data);
      setMessages((prev) => [...prev, data.content]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
      setStatus("Disconnected");
    })
  };

  const sendMessage = () => {
    const socket = socketRef.current;

    if (!socket) return;

    if(!input.trim()) return;

    socket.emit("message:send", {
      content: input,
    })

    setInput("");
  };

  const disconnect = () => {
    socketRef.current?.disconnect();
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
