"use client";

import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

export default function Home() {
  const socketRef = useRef<WebSocket | null>(null);

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

  const sendPing = () => {
    const socket = socketRef.current;

    if (!socket) {
      console.log("Socket does not exist");
      return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      console.log("Socket is not open");
      return;
    }

    socket.send("ping");

    console.log("Sent: ping");
  };

  const disconnect = () => {
    socketRef.current?.close();
  };

  return (
    <main>
      <div>
        <h1>WebSocket Demo</h1>

        <p>Status: {status}</p>
        <p>Server response: {response}</p>

        <Button variant="default" onClick={connect}>
          Connect
        </Button>

        <Button variant="default" onClick={sendPing}>
          Send Ping
        </Button>

        <Button variant="destructive" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    </main>
  );
}
