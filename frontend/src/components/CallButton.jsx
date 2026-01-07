import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <button onClick={handleVideoCall} className="btn btn-success btn-sm text-white gap-2">
      <VideoIcon className="size-5" />
      Video Call
    </button>
  );
}

export default CallButton;
