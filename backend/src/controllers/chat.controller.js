import { generateLiveKitToken, generateRoomToken } from "../lib/livekit.js";

export async function getLiveKitToken(req, res) {
  try {
    const token = await generateLiveKitToken(
      req.user._id.toString(),
      req.user.fullName,
      {
        profilePic: req.user.profilePic,
      }
    );

    res.status(200).json({
      token,
      url: process.env.LIVEKIT_URL,
    });
  } catch (error) {
    console.log("Error in getLiveKitToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getRoomToken(req, res) {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const token = await generateRoomToken(
      req.user._id.toString(),
      req.user.fullName,
      roomId
    );

    res.status(200).json({
      token,
      url: process.env.LIVEKIT_URL,
    });
  } catch (error) {
    console.log("Error in getRoomToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
