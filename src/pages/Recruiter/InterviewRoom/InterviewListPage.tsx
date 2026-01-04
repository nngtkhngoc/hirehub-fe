import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRoomsByRecruiterId, getRoomsByApplicantId } from "@/apis/interview.api";
import { useAuthStore } from "@/stores/useAuthStore";
import type { InterviewRoom } from "@/types/Interview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, User, Video, Lock } from "lucide-react";
import { toast } from "sonner";

export const InterviewListPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [rooms, setRooms] = useState<InterviewRoom[]>([]);
  const [loading, setLoading] = useState(true);

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
        toast.error("Failed to load interview rooms");
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleJoinRoom = (roomCode: string) => {
    navigate(`/interview-room/${roomCode}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Interview Rooms</h1>
        <p className="text-gray-600">
          {user?.role?.name?.toLowerCase() === "recruiter"
            ? "Manage your scheduled interviews"
            : "Your upcoming and past interviews"}
        </p>
      </div>

      {rooms.length === 0 ? (
        <Card className="p-12 text-center">
          <Video className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No Interview Rooms
          </h3>
          <p className="text-gray-600">
            {user?.role?.name?.toLowerCase() === "recruiter"
              ? "You haven't created any interview rooms yet."
              : "You don't have any scheduled interviews yet."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {rooms.map((room) => (
            <Card key={room.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Job Title */}
                  <h3 className="text-xl font-semibold mb-2">{room.jobTitle}</h3>

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
                      {room.status}
                    </span>
                    {room.isExpired && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        EXPIRED
                      </span>
                    )}
                  </div>

                  {/* Show button for all rooms except CANCELLED */}
                  {room.status !== "CANCELLED" && (
                    <Button 
                      onClick={() => handleJoinRoom(room.roomCode)}
                      variant={
                        room.status === "FINISHED" || room.isExpired
                          ? "outline"
                          : "default"
                      }
                    >
                      {room.status === "FINISHED" || room.isExpired
                        ? "View History"
                        : "Join Room"}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

