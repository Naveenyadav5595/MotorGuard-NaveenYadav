// loading .env file to use process.env
import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app= express();
import userRoutes from "./src/routes/userRoutes.js";
import motorRoutes from "./src/routes/motorRoutes.js";
import sensorRoutes from "./src/routes/sensorRoutes.js";
import alertRoutes from "./src/routes/alertRoutes.js";
import logRoutes from "./src/routes/logRoutes.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(  { origin: process.env.FRONTEND_URL} ) );

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.set("io", io);

app.use("/users",userRoutes);
app.use("/motors",motorRoutes);
app.use("/sensors",sensorRoutes);
app.use("/alerts",alertRoutes);
app.use("/logs",logRoutes);

export {server};

