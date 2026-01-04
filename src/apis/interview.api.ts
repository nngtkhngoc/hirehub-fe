import { axiosClient } from "@/lib/axios";
import type {
  CreateInterviewRoomRequest,
  InterviewRoom,
  InterviewMessage,
  CreateInterviewResultRequest,
  InterviewResult,
  InterviewQuestion,
  QuestionBank,
  CreateQuestionBankRequest,
  CreateScheduleRequestDTO,
  InterviewScheduleRequest,
  SelectTimeSlotDTO,
} from "@/types/Interview";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const createInterviewRoom = async (data: CreateInterviewRoomRequest) => {
  const res = await axiosClient.post(`${BASE_URL}/api/interview-rooms`, data);
  return res.data.data as InterviewRoom;
};

export const getRoomByCode = async (roomCode: string) => {
  const res = await axiosClient.get(
    `${BASE_URL}/api/interview-rooms/code/${roomCode}`
  );
  return res.data.data as InterviewRoom;
};

export const getRoomById = async (id: number) => {
  const res = await axiosClient.get(`${BASE_URL}/api/interview-rooms/${id}`);
  return res.data.data as InterviewRoom;
};

export const getRoomsByRecruiterId = async (recruiterId: number) => {
  const res = await axiosClient.get(
    `${BASE_URL}/api/interview-rooms/recruiter/${recruiterId}`
  );
  return res.data.data as InterviewRoom[];
};

export const getRoomsByApplicantId = async (applicantId: number) => {
  const res = await axiosClient.get(
    `${BASE_URL}/api/interview-rooms/applicant/${applicantId}`
  );
  return res.data.data as InterviewRoom[];
};

export const updateRoomStatus = async (roomCode: string, status: string) => {
  const res = await axiosClient.put(
    `${BASE_URL}/api/interview-rooms/${roomCode}/status`,
    { status }
  );
  return res.data.data as InterviewRoom;
};

export const getMessagesByRoomCode = async (roomCode: string) => {
  const res = await axiosClient.get(
    `${BASE_URL}/api/interview-rooms/${roomCode}/messages`
  );
  return res.data.data as InterviewMessage[];
};

export const submitInterviewResult = async (
  data: CreateInterviewResultRequest
) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/interview-rooms/results`,
    data
  );
  return res.data.data as InterviewResult;
};

export const getResultByRoomId = async (roomId: number) => {
  const res = await axiosClient.get(
    `${BASE_URL}/api/interview-rooms/results/room/${roomId}`
  );
  return res.data.data as InterviewResult;
};

export const validateAccess = async (roomCode: string, userId: number) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/interview-rooms/validate-access`,
    { roomCode, userId }
  );
  return res.data.data.hasAccess as boolean;
};

// Question Bank APIs
export const createQuestionBank = async (data: CreateQuestionBankRequest) => {
  const res = await axiosClient.post(`${BASE_URL}/api/question-banks`, data);
  return res.data.data as QuestionBank;
};

export const getQuestionBanksByRecruiterId = async (recruiterId: number) => {
  const res = await axiosClient.get(
    `${BASE_URL}/api/question-banks/recruiter/${recruiterId}`
  );
  return res.data.data as QuestionBank[];
};

export const getQuestionBankById = async (id: number) => {
  const res = await axiosClient.get(`${BASE_URL}/api/question-banks/${id}`);
  return res.data.data as QuestionBank;
};

export const updateQuestionBank = async (
  id: number,
  data: CreateQuestionBankRequest
) => {
  const res = await axiosClient.put(
    `${BASE_URL}/api/question-banks/${id}`,
    data
  );
  return res.data.data as QuestionBank;
};

export const deleteQuestionBank = async (id: number) => {
  const res = await axiosClient.delete(`${BASE_URL}/api/question-banks/${id}`);
  return res.data;
};

// Interview Question APIs
export const getInterviewQuestions = async (roomId: number) => {
  const res = await axiosClient.get(
    `${BASE_URL}/api/interview-rooms/${roomId}/questions`
  );
  return res.data.data as InterviewQuestion[];
};

export const answerQuestion = async (questionId: number, answer: string) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/interview-rooms/questions/${questionId}/answer`,
    { answer }
  );
  return res.data.data as InterviewQuestion;
};

export const evaluateQuestion = async (
  questionId: number,
  evaluation: "PASS" | "FAIL"
) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/interview-rooms/questions/${questionId}/evaluate`,
    { evaluation }
  );
  return res.data.data as InterviewQuestion;
};

export const markQuestionAsSent = async (questionId: number) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/interview-rooms/questions/${questionId}/mark-sent`
  );
  return res.data.data as InterviewQuestion;
};

export const submitAsyncResult = async (data: CreateInterviewResultRequest) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/interview-rooms/results/async`,
    data
  );
  return res.data.data as InterviewResult;
};

export const saveDraftResult = async (data: CreateInterviewResultRequest) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/interview-rooms/results/draft`,
    data
  );
  return res.data.data as InterviewResult;
};

// Interview Schedule Request APIs
export const createScheduleRequest = async (data: CreateScheduleRequestDTO) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/interview-schedule/request`,
    data
  );
  return res.data.data as InterviewScheduleRequest;
};

export const getScheduleRequestByCode = async (requestCode: string) => {
  const res = await axiosClient.get(
    `${BASE_URL}/api/interview-schedule/request/${requestCode}`
  );
  return res.data.data as InterviewScheduleRequest;
};

export const selectTimeSlot = async (data: SelectTimeSlotDTO) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/interview-schedule/select`,
    data
  );
  return res.data.data as InterviewRoom;
};

export const getPendingScheduleRequestsByApplicant = async (
  applicantId: number
) => {
  const res = await axiosClient.get(
    `${BASE_URL}/api/interview-schedule/pending/applicant/${applicantId}`
  );
  return res.data.data as InterviewScheduleRequest[];
};

export const getPendingScheduleRequestsByRecruiter = async (
  recruiterId: number
) => {
  const res = await axiosClient.get(
    `${BASE_URL}/api/interview-schedule/pending/recruiter/${recruiterId}`
  );
  return res.data.data as InterviewScheduleRequest[];
};

export const getAllScheduleRequestsByApplicant = async (
  applicantId: number
) => {
  const res = await axiosClient.get(
    `${BASE_URL}/api/interview-schedule/all/applicant/${applicantId}`
  );
  return res.data.data as InterviewScheduleRequest[];
};

export const getAllScheduleRequestsByRecruiter = async (
  recruiterId: number
) => {
  const res = await axiosClient.get(
    `${BASE_URL}/api/interview-schedule/all/recruiter/${recruiterId}`
  );
  return res.data.data as InterviewScheduleRequest[];
};
