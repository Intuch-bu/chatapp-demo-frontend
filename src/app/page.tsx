"use client";

import { io, Socket } from "socket.io-client";
import { useRef, useState } from "react";

export default function Home() {
  const socketRef = useRef<Socket | null>(null);

  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Disconnected");

  const listenForMessages = (socket: Socket) => {
    socket.on("message:new", (data) => {
      console.log("New message:", data);
    });

    socket.on("message:error", (data) => {
      console.error("Message error:", data.message);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
    });
  };
  const conversationJoined = (socket: Socket) => {
    socket.on("conversation:joined", (data) => {
      console.log("Joined conversation:", data.conversationId);
    });
  };
  const conversationJoinedError = (socket: Socket) => {
    socket.on("conversation:error", (data) => {
      console.error("Conversation error:", data.message);
    });
  };

  const connectAsUser = (userId: number) => {
    const socket = io("http://localhost:8080", {
      auth: {
        userId: userId,
      },
    });

    socketRef.current = socket;
    listenForMessages(socket);
    conversationJoined(socket);
    conversationJoinedError(socket);

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      setStatus("Connected as User");
    });

    socket.emit("conversation:join", {
      conversationId: 1,
    });
  };

  const connectAsAdmin = () => {
    const socket = io("http://localhost:8080", {
      auth: {
        userId: 2,
      },
    });

    socketRef.current = socket;
    listenForMessages(socket);
    conversationJoined(socket);
    conversationJoinedError(socket);

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      setStatus("Connected as Admin");
    });
  };

  const joinConversation = () => {
    const socket = socketRef.current;

    if (!socket) return;

    socket.emit("conversation:join", {
      conversationId: 1,
    });
  };

  const sendMessage = () => {
    const socket = socketRef.current;

    if (!socket) return;

    socket.emit("message:send", {
      conversationId: 1,
      content: input,
    });

    setInput("");
  };

  return (
    <main>
      <h1>Phase 4</h1>

      <p>{status}</p>

      <button onClick={() => connectAsUser(1)}>Connect as User1</button>
      <button onClick={() => connectAsUser(3)}>Connect as User3</button>

      <button onClick={connectAsAdmin}>Connect as Admin</button>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
      <button onClick={joinConversation}>Join Conversation</button>
    </main>
  );
}
