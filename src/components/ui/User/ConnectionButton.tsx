/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserPlus } from "lucide-react";
import { OutlineButton, PrimaryButton } from "./Button";
import { useMediaQuery } from "@mui/material";
import type { UserProfile } from "@/types/Auth";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  useCreateRelationship,
  useFriends,
  useRelationship,
  useDisconnect,
} from "@/hooks/useRelationship";
import { toast } from "sonner";
export type ButtonVariant = "primary" | "outline";

const ConnectionButton = ({
  targetUser,
  variant = "primary",
}: {
  targetUser: UserProfile | undefined;
  variant?: ButtonVariant;
}) => {
  const isMedium = useMediaQuery("(min-width:768px)");

  const user = useAuthStore((state) => state.user);

  const { data: friends } = useFriends(Number(user?.id));
  const { data: relationships } = useRelationship(Number(user?.id));
  const { mutate: createRelationship } = useCreateRelationship();
  const { mutate: disconnectFriend } = useDisconnect();

  const isFriend = friends?.some(
    (friend: any) => friend.user?.id === targetUser?.id
  );

  // Check if current user sent a pending request to target user
  const hasPendingRequest = relationships?.some((rel: any) => {
    return (
      rel.sender.id === user?.id &&
      rel.receiver.id === targetUser?.id &&
      rel.status === "pending"
    );
  });

  // Determine button text based on state
  const text = isFriend
    ? "Hủy kết nối"
    : hasPendingRequest
      ? "Hủy lời mời"
      : "Kết nối";

  const handleConnect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    // State 1: Already connected → Disconnect
    if (isFriend) {
      disconnectFriend(
        {
          senderId: Number(user?.id),
          receiverId: Number(targetUser?.id),
        },
        {
          onSuccess: () => {
            toast.success("Đã hủy kết nối!", { duration: 2000 });
          },
          onError: () => {
            toast.error("Không thể hủy kết nối!", { duration: 2000 });
          },
        }
      );
      return;
    }

    // State 2: Pending request sent → Cancel request (delete connection)
    if (hasPendingRequest) {
      disconnectFriend(
        {
          senderId: Number(user?.id),
          receiverId: Number(targetUser?.id),
        },
        {
          onSuccess: () => {
            toast.success("Đã hủy lời mời!", { duration: 2000 });
          },
          onError: () => {
            toast.error("Không thể hủy lời mời!", { duration: 2000 });
          },
        }
      );
      return;
    }

    // State 3: Not connected → Create connection request
    createRelationship({
      senderId: Number(user?.id),
      receiverId: Number(targetUser?.id),
    });
  };

  // Determine button variant: outlined for cancel/disconnect, primary for connect
  const buttonVariant = isFriend || hasPendingRequest ? "outline" : variant;

  switch (buttonVariant) {
    case "outline":
      return (
        <OutlineButton
          onClick={handleConnect}
          paddingX="px-[80px]"
          paddingY="py-[8px]"
          label={
            <div className="flex flex-row justify-center items-center gap-3 text-[#5E1EE6] text-[12px] font-title font-medium">
              <UserPlus size={22} />
              <span>{text}</span>
            </div>
          }
        />
      );
    case "primary":
      return (
        <PrimaryButton
          onClick={handleConnect}
          label={
            <div className="flex flex-row items-center text-white gap-2">
              <UserPlus size={isMedium ? 22 : 14} />
              <span className="text-[12px]">{text}</span>
            </div>
          }
        />
      );
    default:
      return (
        <PrimaryButton
          onClick={handleConnect}
          label={
            <div className="flex flex-row items-center text-white gap-2 ">
              <UserPlus size={isMedium ? 22 : 14} />
              <span className="text-[12px]">Kết nối</span>
            </div>
          }
        />
      );
  }
};
export default ConnectionButton;
