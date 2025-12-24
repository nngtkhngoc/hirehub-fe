import type { Conversation } from "@/types/Chat";
import profile from "@/assets/illustration/profile.png";
import {
  ChevronDown,
  ChevronUp,
  Files,
  Folders,
  Images,
  LogOut,
  Settings,
  Trash2,
  UserCircleIcon,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  inviteToGroup,
  kickFromGroup,
  leaveGroup,
  disbandGroup,
} from "@/apis/conversation.api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFriends } from "@/hooks/useRelationship";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const UserDetail = ({
  conversation,
  setView,
}: {
  conversation: Conversation | undefined;
  setView: (view: "image" | "file" | "default") => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [kickDialogOpen, setKickDialogOpen] = useState(false);
  const [disbandDialogOpen, setDisbandDialogOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [userToKick, setUserToKick] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const userId = user?.id ? parseInt(user.id) : 0;
  const isLeader = conversation?.leaderId === userId;

  // Lấy danh sách bạn bè
  const { data: friends, isLoading: friendsLoading } = useFriends(userId);

  // Lọc bạn bè chưa có trong group
  const availableFriends = useMemo(() => {
    if (!friends || !conversation) return [];
    const participantIds = conversation.participants.map((p) => p.id);
    return friends.filter(
      (friend: any) => !participantIds.includes(parseInt(friend.user?.id))
    );
  }, [friends, conversation]);

  // Mutation để mời user vào group
  const inviteMutation = useMutation({
    mutationFn: (participantIds: number[]) =>
      inviteToGroup(conversation!.id, userId, participantIds),
    onSuccess: () => {
      // Socket sẽ tự động gửi event, nhưng vẫn invalidate để đảm bảo
      queryClient.invalidateQueries({ queryKey: ["chat-list"] });
      queryClient.invalidateQueries({ queryKey: ["chat"] });

      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversation?.id.toString(), userId],
      });
      queryClient.invalidateQueries({ queryKey: ["chat-history"] });
      toast.success("Đã mời thành viên vào nhóm!", { duration: 2000 });
      setInviteDialogOpen(false);
      setSelectedFriends([]);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Mời thành viên thất bại!",
        {
          duration: 2000,
        }
      );
    },
  });

  // Mutation để kick user
  const kickMutation = useMutation({
    mutationFn: (participantId: number) =>
      kickFromGroup(conversation!.id, participantId, userId),
    onSuccess: () => {
      // Socket sẽ tự động gửi event, nhưng vẫn invalidate để đảm bảo
      queryClient.invalidateQueries({ queryKey: ["chat-list"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversation?.id.toString(), userId],
      });
      queryClient.invalidateQueries({ queryKey: ["chat"] });
      toast.success("Đã xóa thành viên khỏi nhóm!", { duration: 2000 });
      setKickDialogOpen(false);
      setUserToKick(null);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Xóa thành viên thất bại!",
        {
          duration: 2000,
        }
      );
    },
  });

  // Mutation để rời group
  const leaveMutation = useMutation({
    mutationFn: () => leaveGroup(conversation!.id, userId),
    onSuccess: () => {
      // Socket sẽ tự động gửi event, nhưng vẫn invalidate để đảm bảo
      queryClient.invalidateQueries({ queryKey: ["chat-list"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["chat-history"] });
      toast.success("Đã rời khỏi nhóm!", { duration: 2000 });
      setLeaveDialogOpen(false);
      navigate("/chat");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Rời nhóm thất bại!", {
        duration: 2000,
      });
    },
  });

  // Mutation để giải tán nhóm
  const disbandMutation = useMutation({
    mutationFn: () => disbandGroup(conversation!.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-list"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success("Đã giải tán nhóm!", { duration: 2000 });
      setDisbandDialogOpen(false);
      navigate("/chat");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Giải tán nhóm thất bại!", {
        duration: 2000,
      });
    },
  });

  const toggleFriend = (friendId: number) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleInvite = () => {
    if (selectedFriends.length === 0) {
      toast.error("Vui lòng chọn ít nhất một người!", { duration: 2000 });
      return;
    }
    inviteMutation.mutate(selectedFriends);
  };

  const handleKick = (participantId: number, participantName: string) => {
    setUserToKick({ id: participantId, name: participantName });
    setKickDialogOpen(true);
  };

  const confirmKick = () => {
    if (userToKick) {
      kickMutation.mutate(userToKick.id);
    }
  };

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
          <Collapsible
            className="w-full flex flex-col items-center justify-left"
            open={isMembersOpen}
            onOpenChange={setIsMembersOpen}
          >
            <CollapsibleTrigger asChild>
              <div className="w-full flex flex-row items-center gap-2 justify-between rounded-xl hover:bg-zinc-100 py-3 px-3 cursor-pointer">
                <div className="flex flex-row items-center gap-2 justify-center">
                  <Users strokeWidth="1.4" />
                  Thành viên ({conversation.participants.length})
                </div>
                <div className="flex items-center gap-2">
                  {isLeader && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInviteDialogOpen(true);
                      }}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Mời thêm
                    </button>
                  )}
                  {isMembersOpen ? (
                    <ChevronUp className="w-5" />
                  ) : (
                    <ChevronDown className="w-5" />
                  )}
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="w-full flex flex-col px-3">
              {conversation.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 group"
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
                  {/* Nút kick (chỉ hiện cho leader, không hiện cho chính mình) */}
                  {isLeader && participant.id !== userId && (
                    <button
                      onClick={() =>
                        handleKick(
                          participant.id as number,
                          participant.name || "Người dùng"
                        )
                      }
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-100 rounded-full transition-all cursor-pointer"
                      title="Xóa khỏi nhóm"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              {/* Nút rời nhóm (không hiện cho leader nếu còn thành viên khác) */}
              {!isLeader && (
                <button
                  onClick={() => setLeaveDialogOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 mt-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Rời khỏi nhóm</span>
                </button>
              )}
              {isLeader && conversation.participants.length === 1 && (
                <button
                  onClick={() => setLeaveDialogOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 mt-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Rời khỏi nhóm</span>
                </button>
              )}
              {/* Nút giải tán nhóm (chỉ hiện cho leader) */}
              {isLeader && (
                <button
                  onClick={() => setDisbandDialogOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 mt-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Giải tán nhóm</span>
                </button>
              )}
            </CollapsibleContent>
          </Collapsible>
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

      {/* Dialog mời thành viên */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mời thành viên vào nhóm</DialogTitle>
            <DialogDescription>
              Chọn bạn bè để mời vào nhóm chat
            </DialogDescription>
          </DialogHeader>

          <div className="border rounded-lg p-3 max-h-[300px] overflow-y-auto space-y-2">
            {friendsLoading ? (
              <div className="text-center text-sm text-zinc-500 py-4">
                Đang tải...
              </div>
            ) : availableFriends && availableFriends.length > 0 ? (
              availableFriends.map((friend: any) => {
                const friendUser = friend.user;
                const isSelected = selectedFriends.includes(
                  parseInt(friendUser?.id)
                );
                return (
                  <div
                    key={friendUser?.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isSelected
                        ? "bg-primary/10 border border-primary"
                        : "hover:bg-zinc-100"
                      }`}
                    onClick={() => toggleFriend(parseInt(friendUser?.id))}
                  >
                    <img
                      src={friendUser?.avatar || profile}
                      alt={friendUser?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{friendUser?.name}</p>
                      <p className="text-xs text-zinc-500">
                        {friendUser?.email}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <X className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center text-sm text-zinc-500 py-4">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Không có bạn bè nào để mời</p>
                <p className="text-xs mt-1">
                  Tất cả bạn bè đã có trong nhóm hoặc bạn chưa có bạn bè
                </p>
              </div>
            )}
          </div>
          {selectedFriends.length > 0 && (
            <p className="text-xs text-zinc-500">
              Đã chọn {selectedFriends.length} người
            </p>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setInviteDialogOpen(false);
                setSelectedFriends([]);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleInvite}
              disabled={
                selectedFriends.length === 0 || inviteMutation.isPending
              }
              className="bg-gradient-to-r from-purple-600 to-violet-900 hover:from-purple-800 hover:to-violet-900"
            >
              {inviteMutation.isPending ? "Đang mời..." : "Mời"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận kick */}
      <AlertDialog open={kickDialogOpen} onOpenChange={setKickDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa thành viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa <strong>{userToKick?.name}</strong> khỏi
              nhóm? Người này có thể được mời lại sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToKick(null)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmKick}
              className="bg-red-500 hover:bg-red-600"
              disabled={kickMutation.isPending}
            >
              {kickMutation.isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog xác nhận rời nhóm */}
      <AlertDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận rời nhóm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn rời khỏi nhóm{" "}
              <strong>{conversation?.name}</strong>? Bạn có thể được mời lại bởi
              trưởng nhóm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => leaveMutation.mutate()}
              className="bg-red-500 hover:bg-red-600"
              disabled={leaveMutation.isPending}
            >
              {leaveMutation.isPending ? "Đang rời..." : "Rời nhóm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog xác nhận giải tán nhóm */}
      <AlertDialog open={disbandDialogOpen} onOpenChange={setDisbandDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận giải tán nhóm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn giải tán nhóm{" "}
              <strong>{conversation?.name}</strong>? Tất cả tin nhắn và thành viên sẽ bị xóa. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => disbandMutation.mutate()}
              className="bg-red-600 hover:bg-red-700"
              disabled={disbandMutation.isPending}
            >
              {disbandMutation.isPending ? "Đang giải tán..." : "Giải tán nhóm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
