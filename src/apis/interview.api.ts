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
} from "@/types/Interview";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const createInterviewRoom = async (
  data: CreateInterviewRoomRequest
) => {
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

export const updateRoomStatus = async (
  roomCode: string,
  status: string
) => {
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
  const res = await axiosClient.put(`${BASE_URL}/api/question-banks/${id}`, data);
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

export const submitAsyncResult = async (data: CreateInterviewResultRequest) => {
  const res = await axiosClient.post(
    `${BASE_URL}/api/interview-rooms/results/async`,
    data
  );
  return res.data.data as InterviewResult;
};

