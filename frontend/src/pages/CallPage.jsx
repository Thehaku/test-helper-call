import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getRoomToken } from "../lib/api";

import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";

import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;

const CallPage = () => {
  const { id: callId } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData, isLoading: tokenLoading } = useQuery({
    queryKey: ["roomToken", callId],
    queryFn: () => getRoomToken(callId),
    enabled: !!authUser && !!callId,
  });

  useEffect(() => {
    if (tokenData?.token) {
      setToken(tokenData.token);
    }
  }, [tokenData]);

  const handleDisconnected = () => {
    toast.success("Call ended");
    navigate("/");
  };

  const handleError = (error) => {
    console.error("LiveKit error:", error);
    toast.error("Could not connect to the call. Please try again.");
  };

  if (isLoading || tokenLoading || !token) {
    return <PageLoader />;
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
    <div className="h-screen">
      <LiveKitRoom
        serverUrl={LIVEKIT_URL}
        token={token}
        connect={true}
        audio={true}
        video={true}
        onDisconnected={handleDisconnected}
        onError={handleError}
        data-lk-theme="default"
        style={{ height: "100vh" }}
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
};

export default CallPage;
