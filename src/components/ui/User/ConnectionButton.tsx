import { UserPlus } from "lucide-react";
import { OutlineButton, PrimaryButton } from "./Button";
import { useMediaQuery } from "@mui/material";
import type { UserProfile } from "@/types/Auth";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  useCreateRelationship,
  useFriends,
  useRelationship,
  useUpdateRelationshipStatus,
} from "@/hooks/useRelationship";
import { toast } from "sonner";
export type ButtonVariant = "primary" | "outline";

const ConnectionButton = ({
  targetUser,
  variant = "primary",
}: {
  targetUser: UserProfile;
  variant?: ButtonVariant;
}) => {
  const isMedium = useMediaQuery("(min-width:768px)");

  const user = useAuthStore((state) => state.user);

  const { data: friends } = useFriends(Number(user?.id));
  const { data: relationships } = useRelationship(Number(user?.id));
  const { mutate: createRelationship } = useCreateRelationship();
  const { mutate: updateRelationshipStatus } = useUpdateRelationshipStatus();
  const isFriend = friends?.some(
    (friend: any) => friend.user.id === targetUser?.id
  );

  const isSender = relationships?.some((rel: any) => {
    return (
      rel.sender.id === user?.id &&
      rel.receiver.id === targetUser?.id &&
      rel.status === "pending"
    );
  });
  const isReceiver = relationships?.some((rel: any) => {
    return (
      rel.receiver.id === user?.id &&
      rel.sender.id === targetUser?.id &&
      rel.status === "pending"
    );
  });
  console.log(user);
  // console.log({ targetUser, user, isSender, isReceiver, isFriend });
  const text = isFriend
    ? "Bạn bè"
    : isSender
    ? "Đã gửi lời mời"
    : isReceiver
    ? "Chấp nhận lời mời"
    : "Kết nối";

  const handleConnect = () => {
    if (isFriend) {
      toast.info("Bạn đã là bạn bè của người này rồi!", { duration: 2000 });
      return;
    }
    if (!isFriend && !isSender && !isReceiver) {
      createRelationship({
        senderId: Number(user?.id),
        receiverId: Number(targetUser.id),
      });
      return;
    }
    if (isReceiver) {
      const relationship = relationships.find(
        (rel: any) =>
          rel.receiver.id === Number(user?.id) &&
          rel.sender.id === Number(targetUser.id)
      );
      toast.success("Đã chấp nhận lời mời kết bạn!", { duration: 2000 });
      updateRelationshipStatus({
        id: {
          receiverId: relationship.receiver.id,
          senderId: relationship.sender.id,
        },
        status: "connected",
      });
      return;
    }
  };
  switch (variant) {
    case "outline":
      return (
        <OutlineButton
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
            <div className="flex flex-row items-center text-white gap-2">
              <UserPlus size={isMedium ? 22 : 14} />
              <span className="text-[12px]">Kết nối</span>
            </div>
          }
        />
      );
  }
};
export default ConnectionButton;
