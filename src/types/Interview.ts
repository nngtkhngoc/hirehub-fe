export type InterviewRoomStatus = "SCHEDULED" | "ONGOING" | "FINISHED" | "CANCELLED";

export type InterviewMessageType = "CHAT" | "QUESTION" | "SYSTEM";

export type InterviewSenderRole = "RECRUITER" | "APPLICANT" | "SYSTEM";

export type InterviewRecommendation = "PASS" | "FAIL";

export type InterviewType = "CHAT" | "VIDEO";

export type InterviewMode = "LIVE" | "ASYNC";

export type InterviewQuestionStatus = "PENDING" | "ANSWERED";

export interface InterviewRoom {
  id: number;
  jobId: number;
  jobTitle: string;
  applicantId: number;
  applicantName: string;
  applicantEmail: string;
  applicantAvatar: string;
  recruiterId: number;
  recruiterName: string;
  recruiterEmail: string;
  recruiterAvatar: string;
  roomCode: string;
  scheduledTime: string;
  durationMinutes: number;
  status: InterviewRoomStatus;
  interviewType: InterviewType;
  interviewMode: InterviewMode;
  roundNumber: number;
  previousRoomId?: number;
  emailSent: boolean;
  notificationSent: boolean;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  isExpired: boolean; // Room has expired (past scheduled time + duration)
}

export interface InterviewMessage {
  id?: number;
  roomId?: number;
  senderId: number;
  senderName?: string;
  senderAvatar?: string;
  senderRole: InterviewSenderRole;
  type: InterviewMessageType;
  content: string;
  timestamp: string;
}

export interface CreateInterviewRoomRequest {
  jobId: number;
  applicantId: number;
  recruiterId: number;
  scheduledTime: string;
  durationMinutes?: number; // Duration in minutes (default 60)
  interviewType: InterviewType;
  interviewMode: InterviewMode;
  roundNumber?: number;
  previousRoomId?: number;
  selectedQuestionIds?: number[];
}

export interface InterviewQuestion {
  id: number;
  roomId: number;
  questionId?: number;
  questionContent: string;
  answer?: string;
  orderIndex: number;
  askedAt: string;
  answeredAt?: string;
  status: InterviewQuestionStatus;
}

export interface QuestionBank {
  id: number;
  recruiterId: number;
  recruiterName: string;
  title: string;
  description?: string;
  category: string;
  questions: Question[];
  createdAt: string;
  updatedAt?: string;
}

export interface Question {
  id: number;
  content: string;
  orderIndex: number;
}

export interface CreateQuestionBankRequest {
  recruiterId: number;
  title: string;
  description?: string;
  category: string;
  questions: string[];
}

export interface CreateInterviewMessageRequest {
  roomCode: string;
  senderId: number;
  senderRole: InterviewSenderRole;
  type: InterviewMessageType;
  content: string;
}

export interface InterviewResult {
  id: number;
  roomId: number;
  score: number;
  comment: string;
  privateNotes?: string;
  recommendation: InterviewRecommendation;
  createdAt: string;
}

export interface CreateInterviewResultRequest {
  roomId: number;
  score: number;
  comment: string;
  privateNotes?: string;
  recommendation: InterviewRecommendation;
}

// Flexible Interview Scheduling Types
export type ScheduleRequestStatus = "PENDING" | "SELECTED" | "EXPIRED" | "CANCELLED";

export interface InterviewScheduleRequest {
  id: number;
  jobId: number;
  jobTitle: string;
  applicantId: number;
  applicantName: string;
  applicantEmail: string;
  recruiterId: number;
  recruiterName: string;
  recruiterEmail: string;
  status: ScheduleRequestStatus;
  interviewType: InterviewType;
  interviewMode: InterviewMode;
  roundNumber: number;
  timeSlots: InterviewTimeSlotInfo[];
  selectedTimeSlotId?: number;
  requestCode: string;
  createdAt: string;
  expiresAt?: string;
  respondedAt?: string;
}

export interface InterviewTimeSlotInfo {
  id: number;
  proposedTime: string;
  isAvailable: boolean;
  conflictReason?: string;
}

export interface CreateScheduleRequestDTO {
  jobId: number;
  applicantId: number;
  recruiterId: number;
  proposedTimeSlots: string[]; // ISO datetime strings
  interviewType: InterviewType;
  interviewMode: InterviewMode;
  roundNumber?: number;
  previousRoomId?: number;
  selectedQuestionIds?: number[];
  expirationHours?: number;
}

export interface SelectTimeSlotDTO {
  scheduleRequestId: number;
  timeSlotId: number;
  applicantId: number;
}

