import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Cookies from "js-cookies";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function Header({ socket, userId, setUserId }) {
  const navigate = useNavigate();
  const [searchRoomId, setSearchRoomId] = useState("");

  function createNewRoom() {
    const roomId = uuidv4();
    navigate(`/room/${roomId}`);
    socket.emit("new-room-created", { roomId, userId });
  }

  function joinRoom() {
    if (!searchRoomId) return alert("Please enter a Room ID.");
    navigate(`/room/${searchRoomId}`);
    socket.emit("join-room", { roomId: searchRoomId, userId });
  }

  function login() {
    const newUserId = uuidv4();
    setUserId(newUserId);
    Cookies.setItem("userId", newUserId);
    navigate("/");
  }

  function logout() {
    setUserId(null);
    Cookies.removeItem("userId");
    navigate("/");
  }

  return (
    <Card sx={{ marginTop: 5, backgroundColor: "gray", padding: 2 }} raised>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Link style={{ textDecoration: "none" }} to="/">
            <Button sx={{ color: "white" }} variant="text">
              Home
            </Button>
          </Link>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="Enter Room ID"
            variant="outlined"
            size="small"
            sx={{ backgroundColor: "white", borderRadius: 1 }}
            value={searchRoomId}
            onChange={(e) => setSearchRoomId(e.target.value)}
          />
          <Button sx={{ color: "white" }} variant="contained" onClick={joinRoom}>
            Join Room
          </Button>
        </Box>

        <Box>
          {userId ? (
            <>
              <Button sx={{ color: "white" }} variant="text" onClick={createNewRoom}>
                New Room
              </Button>
              <Button sx={{ color: "white" }} variant="text" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button sx={{ color: "white" }} variant="text" onClick={login}>
              Login
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
}




