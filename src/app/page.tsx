"use client";

import { Button } from "@/components/ui/button";
import { use, useRef, useState } from "react";

export default function Home() {
  const socketRef = useRef<WebSocket | null>(null);

  const [message, setMesage] = useState("");
  const [status, setStatus] = useState("Disconnected");
  const [response, setResponse] = useState("-");

  const connect = () => {
    const socket = new WebSocket("ws://localhost:8080");

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to server");
      setStatus("Connected");
    };

    socket.onmessage = (event) => {
      console.log("Received:", event.data);
      setResponse(event.data);
    };

    socket.onclose = () => {
      console.log("Disconnected from server");
      setStatus("Disconnected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const sendMessage = () => {
    const socket = socketRef.current;

    if (!socket) {
      console.log("Socket does not exist");
      return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      console.log("Socket is not open");
      return;
    }

    socket.send(message);
    console.log("Sent: " + message);
    setResponse(" ");
  };

  const disconnect = () => {
    socketRef.current?.close();
  };

  return (
    <main>
      <div className="flex flex-col gap-2 w-80 mx-auto my-10">
        <h1>WebSocket Demo</h1>

        <p>Status: {status}</p>
        <p>Server response: {response}</p>

        <Button variant="default" onClick={connect}>
          Connect
        </Button>
        <input
          type="text"
          placeholder="Message"
          onChange={(e) => setMesage(e.target.value)}
        />
        <Button variant="default" onClick={sendMessage}>
          Send Message
        </Button>

        <Button variant="destructive" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    </main>
  );
}
