import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

import userRoutes from "./routes/user.route.js";

dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();

// app.use(express.json());

const ORIGIN = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);


// ✅ Parse JSON with bigger limit (to allow profile pics)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

server.listen(PORT, () => {
  console.log("server is running on PORT: " + PORT);
  connectDB();
});