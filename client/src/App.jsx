import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, TextField, Typography } from "@mui/material";

const App = () => {
  const socket = useMemo(
    () =>
      io("http://localhost:8000", {
        withCredentials: true,
      }),
    []
  );

  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [socketId, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [list, setList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, roomId });
    setMessage("");
    setRoomId("");
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("mai connect ho gya id:", socket.id);
      setSocketId(socket.id);
    });

    // socket.on("welcome", (data) => console.log("response: ", data));

    socket.on("received-message", (data) => {
      console.log(data);
      setList((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h6" component="div" gutterBottom>
        Chat App - {socketId}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Message"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <TextField
          label="Room id"
          variant="outlined"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <form onSubmit={handleJoinRoom}>
        <TextField
          label="Room Name"
          variant="outlined"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Join Room
        </Button>
      </form>

      <ul>
        {list.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </Container>
  );
};

export default App;
