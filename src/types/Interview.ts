export interface InterviewRoom {
  id: number;
  roomCode: string;
  recruiterId: number;
  recruiterName: string;
  recruiterEmail?: string;
  recruiterAvatar?: string;
  applicantId: number;
  applicantName: string;
  applicantEmail?: string;
  applicantAvatar?: string;
  jobId: number;
  jobTitle: string;
  scheduledTime: string;
  duration: number;
  status: "SCHEDULED" | "ONGOING" | "FINISHED" | "CANCELLED" | "EXPIRED";
  isExpired: boolean;
  interviewType?: "CHAT" | "VIDEO";
  interviewMode?: "LIVE" | "ASYNC";
  createdAt: string;
  updatedAt: string;
}

export interface CreateInterviewRoomRequest {
  recruiterId: number;
  applicantId: number;
  jobId: number;
  scheduledTime: string;
  durationMinutes?: number;
  interviewType?: "CHAT" | "VIDEO";
  interviewMode?: "LIVE" | "ASYNC";
  roundNumber?: number;
  previousRoomId?: number;
  selectedQuestionIds?: number[];
}

export interface InterviewMessage {
  id: number;
  roomCode: string;
  senderId: number;
  senderName: string;
  senderRole?: "RECRUITER" | "APPLICANT" | "SYSTEM";
  senderAvatar?: string;
  content: string;
  type: "TEXT" | "QUESTION" | "ANSWER" | "SYSTEM";
  timestamp: string;
}

export interface InterviewQuestion {
  id: number;
  roomId: number;
  questionContent: string;
  answer?: string;
  status: "PENDING" | "SENT";
  evaluation?: "PASS" | "FAIL" | "PENDING";
  createdAt: string;
  updatedAt: string;
}

export interface InterviewResult {
  id: number;
  roomId: number;
  overallRating?: number;
  technicalSkills?: number;
  communication?: number;
  problemSolving?: number;
  cultureFit?: number;
  notes?: string;
  score: number;
  comment: string;
  privateNotes?: string;
  recommendation: "PASS" | "FAIL" | "HIRE" | "REJECT" | "CONSIDER";
  isDraft?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInterviewResultRequest {
  roomId: number;
  overallRating?: number;
  technicalSkills?: number;
  communication?: number;
  problemSolving?: number;
  cultureFit?: number;
  notes?: string;
  score: number;
  comment: string;
  privateNotes?: string;
  recommendation: "PASS" | "FAIL" | "HIRE" | "REJECT" | "CONSIDER";
  isDraft?: boolean;
}

export interface Question {
  id: number;
  content: string;
  orderIndex: number;
}

export interface QuestionBank {
  id: number;
  recruiterId: number;
  title: string;
  description?: string;
  questions?: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionBankRequest {
  recruiterId: number;
  title: string;
  description?: string;
  questions: string[];
}

export interface InterviewScheduleRequest {
  id: number;
  requestCode: string;
  recruiterId: number;
  recruiterName: string;
  applicantId: number;
  applicantName: string;
  jobId: number;
  jobTitle: string;
  proposedTimeSlots: TimeSlot[];
  selectedTimeSlot?: TimeSlot;
  duration: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  questionBankIds?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface CreateScheduleRequestDTO {
  recruiterId: number;
  applicantId: number;
  jobId: number;
  proposedTimeSlots: TimeSlot[];
  duration: number;
  questionBankIds?: number[];
}

export interface SelectTimeSlotDTO {
  requestCode: string;
  selectedTimeSlot: TimeSlot;
}
