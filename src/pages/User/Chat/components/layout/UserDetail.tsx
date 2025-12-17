import type { Conversation } from "@/types/Chat";
import profile from "@/assets/illustration/profile.png";
import {
  ChevronDown,
  ChevronUp,
  Files,
  Folders,
  Images,
  Settings,
  UserCircleIcon,
  Users,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link } from "react-router";

export const UserDetail = ({
  conversation,
  setView,
}: {
  conversation: Conversation | undefined;
  setView: (view: "image" | "file" | "default") => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();

  const displayInfo = useMemo(() => {
    if (!conversation) return { name: "", avatar: profile, isGroup: false };

    if (conversation.type === "GROUP") {
      const firstParticipant = conversation.participants.find(
        (p) => p.id !== user?.id
      );
      return {
        name: conversation.name || "Nhóm chat",
        avatar: firstParticipant?.avatar || profile,
        isGroup: true,
      };
    }

    const otherUser = conversation.participants.find((p) => p.id !== user?.id);
    return {
      name: otherUser?.name || "Người dùng",
      avatar: otherUser?.avatar || profile,
      isGroup: false,
      otherUser,
    };
  }, [conversation, user?.id]);

  if (!conversation) {
    return (
      <div className="relative h-full flex flex-col items-center gap-5 border border-zinc-300 rounded-xl bg-white py-30">
        <p className="text-zinc-500">Chọn một cuộc trò chuyện</p>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col items-center gap-5 border border-zinc-300 rounded-xl bg-white py-30 overflow-y-auto">
      <div className="relative">
        <img
          src={displayInfo.avatar}
          className="h-25 w-25 rounded-full object-cover object-center"
        />
        {displayInfo.isGroup && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Users className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>
      <div className="font-bold text-xl text-center px-4">
        {displayInfo.name}
      </div>
      {displayInfo.isGroup && (
        <div className="text-sm text-zinc-500">
          {conversation.participants.length} thành viên
        </div>
      )}
      <div className="flex flex-col items-center text-sm w-full px-5">
        {!displayInfo.isGroup && displayInfo.otherUser && (
          <Link
            to={`/user/${displayInfo.otherUser.id}`}
            className="w-full flex flex-row items-center gap-2 justify-left py-3 rounded-xl hover:bg-zinc-100 px-3 cursor-pointer"
          >
            <UserCircleIcon strokeWidth="1.4" />
            Xem trang cá nhân
          </Link>
        )}
        {displayInfo.isGroup && (
          <div className="w-full flex flex-col gap-2 py-3">
            <div className="text-xs text-zinc-500 px-3">Thành viên:</div>
            {conversation.participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100"
              >
                <img
                  src={participant.avatar || profile}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{participant.name}</p>
                  {participant.id === conversation.leaderId && (
                    <p className="text-xs text-zinc-500">Trưởng nhóm</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className=" w-full flex flex-row items-center gap-2 justify-left py-3 rounded-xl hover:bg-zinc-100 px-3 cursor-pointer">
          <Settings strokeWidth="1.4" />
          Tùy chỉnh đoạn chat
        </div>
        <Collapsible
          className=" w-full flex flex-col items-center justify-left"
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <CollapsibleTrigger asChild>
            <div className=" w-full flex flex-row items-center gap-2 justify-between rounded-xl hover:bg-zinc-100 py-3 px-3 cursor-pointer">
              <div className="flex flex-row items-center gap-2 justify-center">
                <Folders strokeWidth="1.4" />
                Hình ảnh & Files
              </div>
              {isOpen ? (
                <ChevronUp className="w-5" />
              ) : (
                <ChevronDown className="w-5" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className=" w-full flex flex-col items-center justify-left px-3">
            <div
              className=" w-full flex flex-row items-center gap-2 justify-left py-3 rounded-xl hover:bg-zinc-100 px-3 cursor-pointer"
              onClick={() => setView("image")}
            >
              <Images strokeWidth="1.4" />
              Hình ảnh
            </div>
            <div
              className=" w-full flex flex-row items-center gap-2 justify-left py-3 rounded-xl hover:bg-zinc-100 px-3 cursor-pointer"
              onClick={() => setView("file")}
            >
              <Files strokeWidth="1.5" />
              File
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
