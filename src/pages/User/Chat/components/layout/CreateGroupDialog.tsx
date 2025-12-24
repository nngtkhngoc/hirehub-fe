import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFriends } from "@/hooks/useRelationship";
import { useAuthStore } from "@/stores/useAuthStore";
import { createConversation } from "@/apis/conversation.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Users, Plus, X } from "lucide-react";
import profile from "@/assets/illustration/profile.png";
import { useNavigate } from "react-router";

export const CreateGroupDialog = () => {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: friends, isLoading } = useFriends(
    user?.id ? parseInt(user.id) : 0
  );

  const createGroupMutation = useMutation({
    mutationFn: (payload: {
      type: "DIRECT" | "GROUP";
      name?: string;
      creatorId: number;
      participantIds: number[];
    }) => createConversation(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success("Tạo nhóm thành công!", { duration: 2000 });
      setOpen(false);
      setGroupName("");
      setSelectedFriends([]);
      // Navigate to the new conversation
      navigate(`/chat/conversation/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Tạo nhóm thất bại!", {
        duration: 2000,
      });
    },
  });
  console.log(friends, "FRIENDS");
  const toggleFriend = (friendId: number) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      toast.error("Vui lòng nhập tên nhóm!", { duration: 2000 });
      return;
    }

    if (selectedFriends.length === 0) {
      toast.error("Vui lòng chọn ít nhất một thành viên!", { duration: 2000 });
      return;
    }

    if (!user?.id) {
      toast.error("Vui lòng đăng nhập!", { duration: 2000 });
      return;
    }

    createGroupMutation.mutate({
      type: "GROUP",
      name: groupName.trim(),
      creatorId: parseInt(user.id),
      participantIds: [parseInt(user.id), ...selectedFriends],
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 justify-center"
        >
          <Plus className="w-4 h-4" />
          Tạo nhóm chat
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo nhóm chat mới</DialogTitle>
          <DialogDescription>
            Chọn tên nhóm và các thành viên từ danh sách bạn bè đã kết nối
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Tên nhóm <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Nhập tên nhóm..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              maxLength={50}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Chọn thành viên <span className="text-red-500">*</span>
            </label>
            <div className="border rounded-lg p-3 max-h-[300px] overflow-y-auto space-y-2">
              {isLoading ? (
                <div className="text-center text-sm text-zinc-500 py-4">
                  Đang tải...
                </div>
              ) : friends && friends.length > 0 ? (
                friends.map((friend: any) => {
                  const friendUser = friend.user;
                  const isSelected = selectedFriends.includes(
                    parseInt(friendUser?.id)
                  );
                  console.log(friendUser, "FRIEND USER");
                  return (
                    <div
                      key={friendUser?.id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected
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
                        <p className="text-sm font-medium">
                          {friendUser?.name}
                        </p>
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
                  <p>Bạn chưa có bạn bè nào</p>
                  <p className="text-xs mt-1">
                    Kết nối với người khác để tạo nhóm chat
                  </p>
                </div>
              )}
            </div>
            {selectedFriends.length > 0 && (
              <p className="text-xs text-zinc-500 mt-2">
                Đã chọn {selectedFriends.length} thành viên
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setGroupName("");
              setSelectedFriends([]);
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleCreateGroup}
            disabled={
              !groupName.trim() ||
              selectedFriends.length === 0 ||
              createGroupMutation.isPending
            }
            className="bg-gradient-to-r from-purple-600 to-violet-900 hover:from-purple-800 hover:to-violet-900"
          >
            {createGroupMutation.isPending ? "Đang tạo..." : "Tạo nhóm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
