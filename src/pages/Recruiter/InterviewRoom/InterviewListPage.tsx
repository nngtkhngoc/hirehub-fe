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

const ITEMS_PER_PAGE = 6;

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
    if (user?.role?.name?.toLowerCase() === "recruiter") {
      navigate(`/recruiter/interviews/evaluate/${roomId}`);
    } else {
      navigate(`/interviews/evaluate/${roomId}`);
    }
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

  const isRecruiter = user?.role?.name?.toLowerCase() === "recruiter";

  return (
    <div className={`space-y-6 ${!isRecruiter ? "pt-[100px] pb-[50px] container mx-auto px-30 min-h-screen" : ""}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-title text-gray-900">
          {isRecruiter ? "Quản lý Phỏng vấn" : "Lịch phỏng vấn của tôi"}</h1>
        <p className="text-gray-500 mt-1">
          {user?.role?.name?.toLowerCase() === "recruiter"
            ? `Quản lý các cuộc phỏng vấn đã lên lịch (${rooms.length} phòng)`
            : `Các cuộc phỏng vấn sắp tới và đã qua (${rooms.length} phòng)`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-6 animate-pulse flex flex-col h-full">
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 border-t pt-4">
                <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedRooms.map((room) => (
              <Card key={room.id} className="p-6 hover:bg-gray-50/50 transition-all hover:shadow-md flex flex-col h-full group">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${room.status === "SCHEDULED"
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
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Hết hạn
                      </span>
                    )}
                  </div>

                  {/* Job Title */}
                  <h3 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                    {room.jobTitle}
                  </h3>

                  {/* Participants & Schedule */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">
                        {user?.role?.name?.toLowerCase() === "recruiter"
                          ? room.applicantName
                          : room.recruiterName}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(room.scheduledTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 border-l pl-4">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(room.scheduledTime)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t flex flex-col gap-2">
                  {room.status !== "CANCELLED" && (
                    <>
                      {room.status !== "FINISHED" && !room.isExpired && room.status !== "EXPIRED" ? (
                        <Button
                          onClick={() => handleJoinRoom(room.roomCode)}
                          className="w-full"
                          variant="default"
                        >
                          Tham gia Phòng
                        </Button>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => handleJoinRoom(room.roomCode)}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            Lịch sử
                          </Button>
                          <Button
                            onClick={() => handleViewEvaluation(room.id)}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            Đánh giá
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                  {room.status === "CANCELLED" && (
                    <p className="text-center text-sm text-gray-400 py-2">Hợp đồng đã hủy</p>
                  )}
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
