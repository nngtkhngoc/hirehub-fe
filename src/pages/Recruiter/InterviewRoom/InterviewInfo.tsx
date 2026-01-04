import type { InterviewRoom } from "@/types/Interview";
import { Calendar, Clock, User, Briefcase } from "lucide-react";

interface InterviewInfoProps {
  room: InterviewRoom;
}

export const InterviewInfo = ({ room }: InterviewInfoProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Job Info */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Job Position</h3>
        <div className="flex items-start gap-3">
          <Briefcase className="h-5 w-5 text-gray-400 mt-1" />
          <div>
            <p className="font-medium text-gray-900">{room.jobTitle}</p>
            <p className="text-sm text-gray-500">ID: {room.jobId}</p>
          </div>
        </div>
      </div>

      {/* Schedule Info */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Schedule</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-700">
              {formatDate(room.scheduledTime)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-700">
              {formatTime(room.scheduledTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Participants</h3>
        <div className="space-y-4">
          {/* Recruiter */}
          <div className="flex items-start gap-3">
            <img
              src={room.recruiterAvatar || "/default-avatar.png"}
              alt={room.recruiterName}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{room.recruiterName}</p>
              <p className="text-sm text-gray-500">{room.recruiterEmail}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                Recruiter
              </span>
            </div>
          </div>

          {/* Applicant */}
          <div className="flex items-start gap-3">
            <img
              src={room.applicantAvatar || "/default-avatar.png"}
              alt={room.applicantName}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{room.applicantName}</p>
              <p className="text-sm text-gray-500">{room.applicantEmail}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                Applicant
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            room.status === "SCHEDULED"
              ? "bg-yellow-100 text-yellow-800"
              : room.status === "ONGOING"
              ? "bg-green-100 text-green-800"
              : room.status === "FINISHED"
              ? "bg-gray-100 text-gray-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {room.status}
        </div>
      </div>

      {/* Room Code */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Room Code</h3>
        <div className="bg-gray-100 rounded p-2 font-mono text-xs break-all">
          {room.roomCode}
        </div>
      </div>
    </div>
  );
};

