import { useState } from "react";
import { Users, UserX } from "lucide-react";
import { Link } from "react-router-dom";
import profile from "@/assets/illustration/default_profile.webp";
import { useFriends, useDisconnect } from "@/hooks/useRelationship";
import { useAuthStore } from "@/stores/useAuthStore";
import type { UserProfile } from "@/types/Auth";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface Friend {
  user: UserProfile;
}

export const FriendsList = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: friends, isLoading } = useFriends(Number(user?.id));
  const { mutate: disconnectFriend } = useDisconnect();
  const [searchQuery, setSearchQuery] = useState("");

  const handleDisconnect = (friendId: number) => {
    disconnectFriend(
      {
        senderId: Number(user?.id),
        receiverId: friendId,
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
  };

  const filteredFriends = friends?.filter((friend: Friend) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      friend.user.name?.toLowerCase().includes(searchLower) ||
      friend.user.email?.toLowerCase().includes(searchLower)
    );
  });

  const renderSkeleton = () => {
    return Array.from({ length: 3 }).map((_, idx) => (
      <div
        key={idx}
        className="border-t border-[#f2f2f2] flex flex-row justify-between w-full py-4 animate-pulse"
      >
        <div className="flex flex-row gap-3">
          <div className="w-[60px] h-[60px] rounded-full bg-gray-300" />
          <div className="flex flex-col justify-center gap-2">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-3 w-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    ));
  };

  const renderFriends = () => {
    if (!filteredFriends || filteredFriends.length === 0) {
      return (
        <div className="py-8 flex items-center justify-center">
          <Empty className="border-none">
            <EmptyContent>
              <EmptyMedia variant="icon">
                <Users className="text-primary" />
              </EmptyMedia>
              <EmptyTitle className="text-base">
                {searchQuery ? "Không tìm thấy kết quả" : "Chưa có kết nối nào"}
              </EmptyTitle>
              <EmptyDescription className="text-xs">
                {searchQuery
                  ? "Thử tìm kiếm với từ khóa khác."
                  : "Bạn chưa có kết nối nào. Hãy tìm và kết nối với người khác!"}
              </EmptyDescription>
            </EmptyContent>
          </Empty>
        </div>
      );
    }

    return filteredFriends?.map((friend: Friend) => (
      <div
        className="w-full border-t border-[#f2f2f2] py-4 hover:bg-gray-50 transition-colors"
        key={friend.user.id}
      >
        <div className="flex flex-row justify-between items-center w-full">
          <Link
            to={`/user/${friend.user.id}`}
            className="flex flex-row gap-3 flex-1"
          >
            <img
              src={friend.user.avatar || profile}
              className="w-[60px] h-[60px] rounded-full object-cover object-center"
              alt={friend.user.name}
            />
            <div className="flex flex-col justify-center gap-1">
              <div className="font-bold text-gray-900 text-base">
                {friend.user.name}
              </div>
              <div className="text-sm text-gray-500">{friend.user.email}</div>
              {friend.user.position && (
                <div className="text-xs text-gray-400">
                  {friend.user.position}
                </div>
              )}
            </div>
          </Link>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigate(`/user/${friend.user.id}`)}
              title="Xem trang cá nhân"
              className="h-9 w-9"
            >
              <Users size={18} />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="outlined"
                  title="Hủy kết nối"
                  className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <UserX size={18} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận hủy kết nối</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn hủy kết nối với{" "}
                    <span className="font-semibold">{friend.user.name}</span>?
                    Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDisconnect(Number(friend.user.id))}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Xác nhận
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col w-full">
      {/* Search bar */}
      <div className="py-3 mb-2">
        <input
          type="text"
          placeholder="Tìm kiếm bạn bè..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Count */}
      {!isLoading && friends && friends.length > 0 && (
        <div className="py-2 text-sm text-gray-600">
          {filteredFriends?.length === friends.length
            ? `Tổng số: ${friends.length} kết nối`
            : `Hiển thị ${filteredFriends?.length} / ${friends.length} kết nối`}
        </div>
      )}

      {isLoading ? renderSkeleton() : renderFriends()}
    </div>
  );
};
