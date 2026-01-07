import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getRoomToken, getUserFriends } from "../lib/api";
import toast from "react-hot-toast";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  Chat,
} from "@livekit/components-react";
import "@livekit/components-styles";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState(null);
  const [token, setToken] = useState(null);
  const [targetUser, setTargetUser] = useState(null);

  const { authUser } = useAuthUser();

  // Get friends to find the target user info
  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    enabled: !!authUser,
  });

  // Find the target user from friends list
  useEffect(() => {
    if (friends.length > 0 && targetUserId) {
      const friend = friends.find((f) => f._id === targetUserId);
      if (friend) {
        setTargetUser(friend);
      }
    }
  }, [friends, targetUserId]);

  // Generate the room name (consistent for both users)
  useEffect(() => {
    if (authUser && targetUserId) {
      const roomId = [authUser._id, targetUserId].sort().join("-");
      setRoomName(roomId);
    }
  }, [authUser, targetUserId]);

  // Get token for the specific room
  const { data: tokenData, isLoading: tokenLoading } = useQuery({
    queryKey: ["roomToken", roomName],
    queryFn: () => getRoomToken(roomName),
    enabled: !!roomName && !!authUser,
  });

  useEffect(() => {
    if (tokenData?.token) {
      setToken(tokenData.token);
    }
  }, [tokenData]);

  const handleVideoCall = useCallback(() => {
    if (roomName) {
      // In a real app, you'd send this via the chat
      // For now, we'll just navigate and show a toast
      toast.success("Starting video call...");
      navigate(`/call/${roomName}`);
    }
  }, [roomName, navigate]);

  if (tokenLoading || !token || !roomName) {
    return <ChatLoader />;
  }

  if (!LIVEKIT_URL) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <span>Missing VITE_LIVEKIT_URL in frontend .env file</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[93vh]">
      <LiveKitRoom
        serverUrl={LIVEKIT_URL}
        token={token}
        connect={true}
        audio={false}
        video={false}
        data-lk-theme="default"
        style={{ height: "100%" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-base-200 p-4 border-b border-base-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {targetUser && (
                <>
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img src={targetUser.profilePic} alt={targetUser.fullName} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{targetUser.fullName}</h3>
                    <p className="text-xs text-base-content/70">
                      {targetUser.nativeLanguage} → {targetUser.learningLanguage}
                    </p>
                  </div>
                </>
              )}
            </div>
            <CallButton handleVideoCall={handleVideoCall} />
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-hidden">
            <Chat style={{ height: "100%" }} />
          </div>
        </div>

        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
};

export default ChatPage;
