import mongoose from "mongoose";
import User from "../models/user.model.js";
import { isUserOnline } from "../lib/socket.js"; // path to where you export it

export const getLastSeen = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  try {
    const user = await User.findById(id).select("lastSeen");
    if (!user) return res.status(404).json({ message: "User not found" });

    const online = isUserOnline(id);
    return res.json({ online, lastSeen: user.lastSeen });
  } catch (err) {
    console.error("getLastSeen error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
