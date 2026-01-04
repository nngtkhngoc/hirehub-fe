import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRoomsByRecruiterId,
  getRoomsByApplicantId,
} from "@/apis/interview.api";
import { useAuthStore } from "@/stores/useAuthStore";
import type { InterviewRoom } from "@/types/Interview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, User, Video, Lock } from "lucide-react";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

export const InterviewListPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [rooms, setRooms] = useState<InterviewRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!user) return;

    const loadRooms = async () => {
      try {
        let data: InterviewRoom[];
        if (user.role?.name?.toLowerCase() === "recruiter") {
          data = await getRoomsByRecruiterId(Number(user.id));
        } else {
          data = await getRoomsByApplicantId(Number(user.id));
        }
        setRooms(data);
      } catch (error) {
        console.error("Error loading interview rooms:", error);
        toast.error("Không thể tải danh sách phòng phỏng vấn");
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleJoinRoom = (roomCode: string) => {
    navigate(`/interview-room/${roomCode}`);
  };

  const handleViewEvaluation = (roomId: number) => {
    navigate(`/recruiter/interviews/evaluate/${roomId}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(rooms.length / ITEMS_PER_PAGE);
  const paginatedRooms = rooms.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      SCHEDULED: "Đã lên lịch",
      ONGOING: "Đang diễn ra",
      FINISHED: "Đã kết thúc",
      CANCELLED: "Đã hủy",
      EXPIRED: "Đã hết hạn",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Phòng Phỏng vấn của Tôi</h1>
        <p className="text-gray-600">
          {user?.role?.name?.toLowerCase() === "recruiter"
            ? `Quản lý các cuộc phỏng vấn đã lên lịch (${rooms.length} phòng)`
            : `Các cuộc phỏng vấn sắp tới và đã qua (${rooms.length} phòng)`}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="p-6 animate-pulse">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="flex items-center gap-4">
                    <div className="h-4 bg-gray-100 rounded w-32"></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-4 bg-gray-100 rounded w-24"></div>
                    <div className="h-4 bg-gray-100 rounded w-20"></div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                  <div className="h-9 bg-gray-200 rounded w-28"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <Card className="p-12 text-center">
          <Video className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Chưa có Phòng Phỏng vấn
          </h3>
          <p className="text-gray-600">
            {user?.role?.name?.toLowerCase() === "recruiter"
              ? "Bạn chưa tạo phòng phỏng vấn nào."
              : "Bạn chưa có lịch phỏng vấn nào."}
          </p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {paginatedRooms.map((room) => (
              <Card key={room.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Job Title */}
                    <h3 className="text-xl font-semibold mb-2">
                      {room.jobTitle}
                    </h3>

                    {/* Participants */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {user?.role?.name?.toLowerCase() === "recruiter"
                            ? room.applicantName
                            : room.recruiterName}
                        </span>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(room.scheduledTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(room.scheduledTime)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${room.status === "SCHEDULED"
                          ? "bg-yellow-100 text-yellow-800"
                          : room.status === "ONGOING"
                            ? "bg-green-100 text-green-800"
                            : room.status === "FINISHED"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {getStatusText(room.status)}
                      </span>
                      {room.isExpired && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Đã hết hạn
                        </span>
                      )}
                    </div>

                    {/* Show buttons for all rooms except CANCELLED */}
                    {room.status !== "CANCELLED" && (
                      <div className="flex gap-2">
                        {(room.status === "FINISHED" ||
                          room.isExpired ||
                          room.status === "EXPIRED") && (
                            <>
                              <Button
                                onClick={() => handleJoinRoom(room.roomCode)}
                                variant="outline"
                              >
                                Xem Lịch sử
                              </Button>
                              <Button
                                onClick={() => handleViewEvaluation(room.id)}
                                variant="outline"
                              >
                                Xem Đánh giá
                              </Button>
                            </>
                          )}
                        {room.status !== "FINISHED" &&
                          !room.isExpired &&
                          room.status !== "EXPIRED" && (
                            <Button
                              onClick={() => handleJoinRoom(room.roomCode)}
                              variant="default"
                            >
                              Tham gia Phòng
                            </Button>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 0 && setPage(page - 1)}
                      className={page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = page < 3 ? i : page - 2 + i;
                    if (pageNum >= totalPages) return null;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setPage(pageNum)}
                          isActive={page === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => page < totalPages - 1 && setPage(page + 1)}
                      className={
                        page >= totalPages - 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};
