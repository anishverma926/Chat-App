// src/components/ChatHeader.jsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { axiosInstance } from "../lib/axios.js"; // use the configured instance

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [lastSeen, setLastSeen] = useState(null);
  const [loadingLastSeen, setLoadingLastSeen] = useState(false);

  // guard if no selectedUser (avoid crash)
  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    let cancelled = false;
    setLastSeen(null);

    // fetch lastSeen only when user is offline
    if (!isOnline && selectedUser?._id) {
      setLoadingLastSeen(true);
      axiosInstance
        .get(`/users/${selectedUser._id}/last-seen`)
        .then((res) => {
          if (cancelled) return;
          // API returns { online, lastSeen } — prefer server 'online' if available
          const { online, lastSeen } = res.data;
          if (online) {
            // if server says online, keep that (possible race condition)
            setLastSeen(null);
          } else {
            setLastSeen(lastSeen); // ISO timestamp or null
          }
        })
        .catch((err) => {
          if (!cancelled) {
            console.error("Failed to fetch lastSeen:", err?.response?.data || err.message);
          }
        })
        .finally(() => {
          if (!cancelled) setLoadingLastSeen(false);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [isOnline, selectedUser?._id]);

  const formatAgo = (ts) => {
    if (!ts) return null;
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (diff < 10) return "just now";
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} d ago`;
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="object-cover w-10 h-10 rounded-full"
              />

              {/* green dot when online */}
              {isOnline && (
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
              )}
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {isOnline ? (
                "Active now"
              ) : loadingLastSeen ? (
                "Active —"
              ) : lastSeen ? (
                `Active ${formatAgo(lastSeen)}`
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)} aria-label="Close chat">
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
