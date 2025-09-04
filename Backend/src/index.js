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

const allowedOrigins = [
  process.env.CLIENT_URL,      // frontend on Render
  "http://localhost:5173",     // local dev frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman, curl
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  })
);

app.options("*", cors()); // handle preflight requests



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