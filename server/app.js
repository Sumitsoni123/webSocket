import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 8000;
const secretKey = process.env.JWT_KEY;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// middleware to check auth user client
io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err) => {
    if (err) return next(err);

    const token = socket.request.cookies.token;
    if (!token) return next(new Error("Authentication error"));

    const decode = jwt.verify(token, secretKey);
    next();
  });
});

io.on("connection", (socket) => {
  console.log("user connected with id:", socket.id);

  socket.on("message", (data) => {
    console.log("data received->", data);
    io.to(data.roomId).emit("received-message", data.message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`user joined room- ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/login", (req, res) => {
  try {
    const token = jwt.sign({ _id: "abcdefghijkh" }, secretKey, {
      expiresIn: "24h",
    });
    res
      .cookie("token", token, { httpOnly: true })
      .json({ message: "Successfully loggedIn" });
  } catch (error) {
    console.error("Error signing token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`server connected to ${PORT}`);
});
