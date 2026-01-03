import { Users, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import profile from "@/assets/illustration/default_profile.webp";
import {
  useRelationship,
  useUpdateRelationshipStatus,
  useDisconnect,
} from "@/hooks/useRelationship";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

interface Relationship {
  id: {
    senderId: number;
    receiverId: number;
  };
  sender: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    position?: string;
  };
  receiver: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    position?: string;
  };
  status: string;
  createdAt: string;
}

export const RequestsList = () => {
  const { user } = useAuthStore();
  const { data: relationships, isLoading } = useRelationship(Number(user?.id));
  const { mutate: updateStatus } = useUpdateRelationshipStatus();
  const { mutate: deleteRequest } = useDisconnect();
  const [handledRequests, setHandledRequests] = useState<Set<string>>(
    new Set()
  );

  // Filter pending requests where current user is the receiver
  const pendingRequests = relationships?.filter(
    (rel: Relationship) =>
      rel.status === "pending" && rel.receiver.id === Number(user?.id)
  );

  // Filter sent requests where current user is the sender
  const sentRequests = relationships?.filter(
    (rel: Relationship) =>
      rel.status === "pending" && rel.sender.id === Number(user?.id)
  );

  const handleAccept = (senderId: number, receiverId: number) => {
    const requestKey = `${senderId}-${receiverId}`;
    updateStatus(
      {
        id: { senderId, receiverId },
        status: "connected",
      },
      {
        onSuccess: () => {
          toast.success("Đã chấp nhận lời mời kết bạn!", { duration: 2000 });
          setHandledRequests((prev) => new Set(prev).add(requestKey));
        },
        onError: () => {
          toast.error("Không thể chấp nhận lời mời!", { duration: 2000 });
        },
      }
    );
  };

  const handleReject = (senderId: number, receiverId: number) => {
    const requestKey = `${senderId}-${receiverId}`;
    deleteRequest(
      { senderId, receiverId },
      {
        onSuccess: () => {
          toast.success("Đã từ chối lời mời kết bạn!", { duration: 2000 });
          setHandledRequests((prev) => new Set(prev).add(requestKey));
        },
        onError: () => {
          toast.error("Không thể từ chối lời mời!", { duration: 2000 });
        },
      }
    );
  };

  const handleCancelRequest = (senderId: number, receiverId: number) => {
    const requestKey = `${senderId}-${receiverId}`;
    deleteRequest(
      { senderId, receiverId },
      {
        onSuccess: () => {
          toast.success("Đã hủy lời mời!", { duration: 2000 });
          setHandledRequests((prev) => new Set(prev).add(requestKey));
        },
        onError: () => {
          toast.error("Không thể hủy lời mời!", { duration: 2000 });
        },
      }
    );
  };

  const renderSkeleton = () => {
    return Array.from({ length: 2 }).map((_, idx) => (
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

  const renderRequests = () => {
    const hasReceivedRequests = pendingRequests && pendingRequests.length > 0;
    const hasSentRequests = sentRequests && sentRequests.length > 0;

    if (!hasReceivedRequests && !hasSentRequests) {
      return (
        <div className="py-8 flex items-center justify-center">
          <Empty className="border-none">
            <EmptyContent>
              <EmptyMedia variant="icon">
                <Users className="text-primary" />
              </EmptyMedia>
              <EmptyTitle className="text-base">
                Không có lời mời nào
              </EmptyTitle>
              <EmptyDescription className="text-xs">
                Bạn chưa có lời mời kết bạn nào.
              </EmptyDescription>
            </EmptyContent>
          </Empty>
        </div>
      );
    }

    return (
      <>
        {/* Received Requests */}
        {hasReceivedRequests && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 mt-4">
              Lời mời nhận được ({pendingRequests.length})
            </h3>
            {pendingRequests.map((request: Relationship) => {
              const requestKey = `${request.sender.id}-${request.receiver.id}`;
              const isHandled = handledRequests.has(requestKey);

              return (
                <div
                  className="w-full border-t border-[#f2f2f2] py-4 hover:bg-gray-50 transition-colors"
                  key={requestKey}
                >
                  <div className="flex flex-row justify-between items-center w-full">
                    <Link
                      to={`/user/${request.sender.id}`}
                      className="flex flex-row gap-3 flex-1"
                    >
                      <img
                        src={request.sender.avatar || profile}
                        className="w-[60px] h-[60px] rounded-full object-cover object-center"
                        alt={request.sender.name}
                      />
                      <div className="flex flex-col justify-center gap-1">
                        <div className="font-bold text-gray-900 text-base">
                          {request.sender.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.sender.email}
                        </div>
                        {request.sender.position && (
                          <div className="text-xs text-gray-400">
                            {request.sender.position}
                          </div>
                        )}
                      </div>
                    </Link>
                    {!isHandled && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() =>
                            handleAccept(request.sender.id, request.receiver.id)
                          }
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Check size={16} className="mr-1" />
                          Chấp nhận
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleReject(request.sender.id, request.receiver.id)
                          }
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <X size={16} className="mr-1" />
                          Từ chối
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sent Requests */}
        {hasSentRequests && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 mt-4">
              Lời mời đã gửi ({sentRequests.length})
            </h3>
            {sentRequests.map((request: Relationship) => {
              const requestKey = `${request.sender.id}-${request.receiver.id}`;
              const isHandled = handledRequests.has(requestKey);

              return (
                <div
                  className="w-full border-t border-[#f2f2f2] py-4 hover:bg-gray-50 transition-colors"
                  key={requestKey}
                >
                  <div className="flex flex-row justify-between items-center w-full">
                    <Link
                      to={`/user/${request.receiver.id}`}
                      className="flex flex-row gap-3 flex-1"
                    >
                      <img
                        src={request.receiver.avatar || profile}
                        className="w-[60px] h-[60px] rounded-full object-cover object-center"
                        alt={request.receiver.name}
                      />
                      <div className="flex flex-col justify-center gap-1">
                        <div className="font-bold text-gray-900 text-base">
                          {request.receiver.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.receiver.email}
                        </div>
                        {request.receiver.position && (
                          <div className="text-xs text-gray-400">
                            {request.receiver.position}
                          </div>
                        )}
                        <div className="text-xs text-amber-600">
                          Đang chờ phản hồi
                        </div>
                      </div>
                    </Link>
                    {!isHandled && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleCancelRequest(
                            request.sender.id,
                            request.receiver.id
                          )
                        }
                        className="text-primary hover:text-primary py-4 hover:bg-zinc-50"
                      >
                        <X size={16} className="mr-1" />
                        Hủy lời mời
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col w-full">
      {isLoading ? renderSkeleton() : renderRequests()}
    </div>
  );
};
