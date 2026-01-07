import { AccessToken } from "livekit-server-sdk";
import "dotenv/config";

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("LiveKit API key or Secret is missing");
}

/**
 * Generate a LiveKit access token for a user
 * @param {string} identity - User ID
 * @param {string} name - User's display name
 * @param {object} metadata - Additional user metadata
 * @returns {string} JWT token for LiveKit
 */
export const generateLiveKitToken = async (identity, name, metadata = {}) => {
  try {
    const token = new AccessToken(apiKey, apiSecret, {
      identity: identity.toString(),
      name: name,
      metadata: JSON.stringify(metadata),
    });

    // Grant permissions for video/audio
    token.addGrant({
      room: "*", // Allow access to any room
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true, // For chat messages via data channels
    });

    // Token expires in 24 hours
    const jwt = await token.toJwt();
    return jwt;
  } catch (error) {
    console.error("Error generating LiveKit token:", error);
    throw error;
  }
};

/**
 * Generate a LiveKit token for a specific room
 * @param {string} identity - User ID
 * @param {string} name - User's display name
 * @param {string} roomName - Specific room name
 * @returns {string} JWT token for LiveKit
 */
export const generateRoomToken = async (identity, name, roomName) => {
  try {
    const token = new AccessToken(apiKey, apiSecret, {
      identity: identity.toString(),
      name: name,
    });

    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const jwt = await token.toJwt();
    return jwt;
  } catch (error) {
    console.error("Error generating room token:", error);
    throw error;
  }
};
