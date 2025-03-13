import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

export default function ChatWindow() {
  const { socket } = useOutletContext();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef();

  function selectFile() {
    fileRef.current.click();
  }

  function fileSelected(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = reader.result;
      socket.emit("upload", { data, roomId });
    };
  }

  useEffect(() => {
    if (!socket) return;

    socket.on("message-from-server", (data) => {
      setChat((prev) => [...prev, { message: data.message, received: !data.self }]);
    });

    socket.on("uploaded", (data) => {
      setChat((prev) => [...prev, { message: data.buffer, received: true, type: "image" }]);
    });

    socket.on("typing-started-from-server", () => setTyping(true));
    socket.on("typing-stoped-from-server", () => setTyping(false));

    return () => {
      socket.off("message-from-server");
      socket.off("uploaded");
      socket.off("typing-started-from-server");
      socket.off("typing-stoped-from-server");
    };
  }, [socket]);

  function handleForm(e) {
    e.preventDefault();
    if (!message.trim()) return;

    // Send message to server
    socket.emit("send-message", { message, roomId });

    // Update chat immediately for sender
    setChat((prev) => [...prev, { message, received: false }]);

    setMessage("");
  }

  const [typingTimeout, setTypingTimeout] = useState(null);

  function handleInput(e) {
    setMessage(e.target.value);
    socket.emit("typing-started", { roomId });

    if (typingTimeout) clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout(() => {
        socket.emit("typing-stoped", { roomId });
      }, 1000)
    );
  }

  async function removeRoom() {
    socket.emit("room-removed", { roomId });
    navigate("/");
  }

  return (
    <Card sx={{ padding: 3, marginTop: 5, width: "80%", height: "75vh", display: "flex", flexDirection: "column", backgroundColor: "#1E1E1E", color: "white", borderRadius: 3, boxShadow: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        {roomId && <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>Room: {roomId}</Typography>}
        {roomId && <Button size="small" variant="contained" color="error" onClick={removeRoom}>Delete Room</Button>}
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", padding: 2, gap: 2, backgroundColor: "#2A2A2A", borderRadius: 2, boxShadow: "inset 0px 0px 10px rgba(0,0,0,0.3)" }}>
        {chat.map((data, index) => (
          <Box key={index} sx={{ alignSelf: data.received ? "flex-start" : "flex-end", backgroundColor: data.received ? "#ffffff" : "#007AFF", color: data.received ? "black" : "white", padding: "10px 15px", borderRadius: "15px", maxWidth: "65%", boxShadow: "2px 2px 10px rgba(0,0,0,0.2)", wordBreak: "break-word" }}>
            {data.type === "image" ? (
              <img src={data.message} alt="sent-file" width="120" style={{ borderRadius: "10px" }} />
            ) : (
              <Typography>{data.message}</Typography>
            )}
          </Box>
        ))}
      </Box>

      {typing && <Typography sx={{ color: "gray", fontStyle: "italic", marginBottom: 1 }}>Someone is typing...</Typography>}

      <Box component="form" onSubmit={handleForm} sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
        <OutlinedInput sx={{ backgroundColor: "white", flex: 1, borderRadius: "20px", padding: "5px 10px" }} size="small" fullWidth value={message} placeholder="Write a message..." onChange={handleInput} endAdornment={
          <InputAdornment position="end">
            <input onChange={fileSelected} ref={fileRef} type="file" style={{ display: "none" }} />
            <IconButton type="button" sx={{ marginRight: 1 }} onClick={selectFile}><AttachFileIcon /></IconButton>
            <IconButton type="submit"><SendIcon /></IconButton>
          </InputAdornment>
        } />
      </Box>
    </Card>
  );
}
