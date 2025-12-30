import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRelationship, useFriends, useUpdateRelationshipStatus, useDisconnect } from "@/hooks/useRelationship";
import { toast } from "sonner";
import { Users, UserPlus, UserMinus, UserCheck, UserX, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import defaultAvatar from "@/assets/illustration/profile.png";

interface Friend {
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
}

interface Relationship {
  sender: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  receiver: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  status: string;
  createdAt: string;
}

export const RelationshipsPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("friends");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "disconnect" | "accept" | "reject" | "cancel";
    userId: number;
    userName: string;
  } | null>(null);

  const { data: friends = [], isLoading: friendsLoading } = useFriends(Number(user?.id));
  const { data: relationships = [], isLoading: relationshipsLoading } = useRelationship(Number(user?.id));
  const { mutate: updateStatus } = useUpdateRelationshipStatus();
  const { mutate: disconnect } = useDisconnect();

  // Filter relationships
  const sentRequests = relationships.filter(
    (rel: Relationship) =>
      rel.sender.id === user?.id && rel.status === "pending"
  );

  const receivedRequests = relationships.filter(
    (rel: Relationship) =>
      rel.receiver.id === user?.id && rel.status === "pending"
  );

  // Search filter
  const filterBySearch = (items: any[], searchTerm: string) => {
    if (!searchTerm) return items;
    return items.filter(
      (item: any) =>
        item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sender?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.receiver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.receiver?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredFriends = filterBySearch(friends, searchKeyword);
  const filteredSentRequests = filterBySearch(sentRequests, searchKeyword);
  const filteredReceivedRequests = filterBySearch(receivedRequests, searchKeyword);

  const handleConfirmAction = () => {
    if (!confirmDialog) return;

    switch (confirmDialog.type) {
      case "disconnect":
        disconnect(
          { senderId: Number(user?.id), receiverId: confirmDialog.userId },
          {
            onSuccess: () => toast.success("Đã hủy kết nối"),
            onError: () => toast.error("Không thể hủy kết nối"),
          }
        );
        break;
      case "cancel":
        disconnect(
          { senderId: Number(user?.id), receiverId: confirmDialog.userId },
          {
            onSuccess: () => toast.success("Đã hủy lời mời"),
            onError: () => toast.error("Không thể hủy lời mời"),
          }
        );
        break;
      case "accept":
        updateStatus(
          {
            id: { senderId: confirmDialog.userId, receiverId: Number(user?.id) },
            status: "connected",
          },
          {
            onSuccess: () => toast.success("Đã chấp nhận lời mời"),
            onError: () => toast.error("Không thể chấp nhận"),
          }
        );
        break;
      case "reject":
        updateStatus(
          {
            id: { senderId: confirmDialog.userId, receiverId: Number(user?.id) },
            status: "rejected",
          },
          {
            onSuccess: () => toast.success("Đã từ chối lời mời"),
            onError: () => toast.error("Không thể từ chối"),
          }
        );
        break;
    }
    setConfirmDialog(null);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const renderUserCard = (userData: any, action: React.ReactNode) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-lg">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary to-purple-600">
          {userData.avatar ? (
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={defaultAvatar}
              alt="Default"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <a
            href={`/user/${userData.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-900 hover:text-primary transition-colors block truncate"
          >
            {userData.name || "Chưa đặt tên"}
          </a>
          <p className="text-sm text-gray-500 truncate">{userData.email}</p>
        </div>
      </div>
      <div className="flex-shrink-0">{action}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-[100px] pb-[50px] px-4 md:px-20">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-3xl font-bold font-title text-gray-900">
            Kết nối của tôi
          </h1>
          <p className="text-gray-500 mt-2">
            Quản lý bạn bè và lời mời kết nối
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white p-1 rounded-lg shadow-sm border border-gray-100">
            <TabsTrigger
              value="friends"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Users size={18} className="mr-2" />
              Bạn bè ({filteredFriends.length})
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <UserPlus size={18} className="mr-2" />
              Đã gửi ({filteredSentRequests.length})
            </TabsTrigger>
            <TabsTrigger
              value="received"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <UserCheck size={18} className="mr-2" />
              Nhận được ({filteredReceivedRequests.length})
            </TabsTrigger>
          </TabsList>

          {/* Friends Tab */}
          <TabsContent value="friends" className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {friendsLoading ? (
              <div className="p-12 text-center text-gray-400">Đang tải...</div>
            ) : filteredFriends.length === 0 ? (
              <div className="p-12">
                <Empty>
                  <EmptyContent>
                    <EmptyMedia variant="icon">
                      <Users className="text-primary" />
                    </EmptyMedia>
                    <EmptyTitle>Chưa có bạn bè nào</EmptyTitle>
                    <EmptyDescription>
                      {searchKeyword
                        ? "Không tìm thấy bạn bè nào khớp với tìm kiếm"
                        : "Hãy kết nối với người dùng khác để mở rộng mạng lưới của bạn"}
                    </EmptyDescription>
                  </EmptyContent>
                </Empty>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredFriends.map((friend: Friend) =>
                  renderUserCard(
                    friend.user,
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-600 hover:bg-red-50"
                      onClick={() =>
                        setConfirmDialog({
                          open: true,
                          type: "disconnect",
                          userId: friend.user.id,
                          userName: friend.user.name,
                        })
                      }
                    >
                      <UserMinus size={16} className="mr-2" />
                      Hủy kết nối
                    </Button>
                  )
                )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Sent Requests Tab */}
          <TabsContent value="sent" className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {relationshipsLoading ? (
              <div className="p-12 text-center text-gray-400">Đang tải...</div>
            ) : filteredSentRequests.length === 0 ? (
              <div className="p-12">
                <Empty>
                  <EmptyContent>
                    <EmptyMedia variant="icon">
                      <UserPlus className="text-primary" />
                    </EmptyMedia>
                    <EmptyTitle>Chưa gửi lời mời nào</EmptyTitle>
                    <EmptyDescription>
                      {searchKeyword
                        ? "Không tìm thấy lời mời nào khớp với tìm kiếm"
                        : "Các lời mời kết nối bạn đã gửi sẽ hiển thị ở đây"}
                    </EmptyDescription>
                  </EmptyContent>
                </Empty>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredSentRequests.map((rel: Relationship) =>
                  renderUserCard(
                    rel.receiver,
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-600"
                        onClick={() =>
                          setConfirmDialog({
                            open: true,
                            type: "cancel",
                            userId: rel.receiver.id,
                            userName: rel.receiver.name,
                          })
                        }
                      >
                        <UserX size={16} className="mr-2" />
                        Hủy lời mời
                      </Button>
                      <span className="text-xs text-gray-400">
                        Gửi lúc {formatDate(rel.createdAt)}
                      </span>
                    </div>
                  )
                )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Received Requests Tab */}
          <TabsContent value="received" className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {relationshipsLoading ? (
              <div className="p-12 text-center text-gray-400">Đang tải...</div>
            ) : filteredReceivedRequests.length === 0 ? (
              <div className="p-12">
                <Empty>
                  <EmptyContent>
                    <EmptyMedia variant="icon">
                      <UserCheck className="text-primary" />
                    </EmptyMedia>
                    <EmptyTitle>Chưa có lời mời nào</EmptyTitle>
                    <EmptyDescription>
                      {searchKeyword
                        ? "Không tìm thấy lời mời nào khớp với tìm kiếm"
                        : "Lời mời kết nối từ người dùng khác sẽ hiển thị ở đây"}
                    </EmptyDescription>
                  </EmptyContent>
                </Empty>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredReceivedRequests.map((rel: Relationship) =>
                  renderUserCard(
                    rel.sender,
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-600 hover:bg-green-50"
                          onClick={() =>
                            setConfirmDialog({
                              open: true,
                              type: "accept",
                              userId: rel.sender.id,
                              userName: rel.sender.name,
                            })
                          }
                        >
                          <UserCheck size={16} className="mr-2" />
                          Chấp nhận
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-600 hover:bg-red-50"
                          onClick={() =>
                            setConfirmDialog({
                              open: true,
                              type: "reject",
                              userId: rel.sender.id,
                              userName: rel.sender.name,
                            })
                          }
                        >
                          <UserX size={16} className="mr-2" />
                          Từ chối
                        </Button>
                      </div>
                      <span className="text-xs text-gray-400">
                        Nhận lúc {formatDate(rel.createdAt)}
                      </span>
                    </div>
                  )
                )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog?.open}
        onOpenChange={(open) => !open && setConfirmDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog?.type === "disconnect" && "Xác nhận hủy kết nối"}
              {confirmDialog?.type === "cancel" && "Xác nhận hủy lời mời"}
              {confirmDialog?.type === "accept" && "Xác nhận chấp nhận"}
              {confirmDialog?.type === "reject" && "Xác nhận từ chối"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog?.type === "disconnect" &&
                `Bạn có chắc muốn hủy kết nối với "${confirmDialog.userName}"?`}
              {confirmDialog?.type === "cancel" &&
                `Bạn có chắc muốn hủy lời mời kết nối đã gửi tới "${confirmDialog.userName}"?`}
              {confirmDialog?.type === "accept" &&
                `Bạn có chắc muốn chấp nhận lời mời kết nối từ "${confirmDialog.userName}"?`}
              {confirmDialog?.type === "reject" &&
                `Bạn có chắc muốn từ chối lời mời kết nối từ "${confirmDialog.userName}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>
  );
};

