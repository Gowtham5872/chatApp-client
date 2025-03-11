import React, { useEffect } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import ChatWindow from "../components/ChatWindow.js";

export default function Room() {
  const { roomId } = useParams();
  const { socket } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;
    
    socket.emit("join-room", { roomId });

    socket.on("room-not-found", () => {
      alert("Room ID does not exist!");
      navigate("/");
    });
  }, [socket]);

  return <ChatWindow />;
}

