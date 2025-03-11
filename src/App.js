import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Cookies from "js-cookies";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";
import Header from "./components/Header";
import chatBg from "./assets/chatbg.jpg";


function App() {
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setSocket(io("http://localhost:4000"));
    const _userId = Cookies.getItem("userId");
    if (_userId) setUserId(_userId);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${chatBg})`,  // Chat-related background
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Container>
        <Header socket={socket} userId={userId} setUserId={setUserId} />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Outlet context={{ socket, userId }} />
        </Box>
      </Container>
    </Box>
  );
}

export default App;
