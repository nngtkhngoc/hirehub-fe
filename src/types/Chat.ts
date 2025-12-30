import type { UserProfile } from "./Auth";

export type SeenUser = {
  id?: string | number;
  email?: string;
  emoji?: string;
};

export type Message = {
  id?: string;
  content?: string;
  fileName?: string;
  type?: string;
  createdAt: string;
  sender: UserProfile | undefined | null;
  conversationId?: number;
  seenUsers: (SeenUser | undefined)[];
};

export type CreateMessageRequest = {
  content?: string;
  type?: string;
  fileName?: string;

  senderEmail?: string;
  conversationId: number;
};

export type ConversationType = "DIRECT" | "GROUP";

export type Conversation = {
  id: number;
  type: ConversationType;
  name?: string;
  leaderId?: number | null;
  participants: UserProfile[];
  lastMessage?: Message | null;
  createdAt: string;
  updatedAt: string;
  unreadCount?: number;
  deletedAt?: string | null;
};

// Group event types for socket notifications
export type GroupEventType = "MEMBER_KICKED" | "MEMBER_LEFT" | "MEMBER_INVITED" | "GROUP_CREATED" | "GROUP_DISBANDED";

export type GroupEventData = {
  conversationId: number;
  eventType: GroupEventType;
  actor: UserProfile;
  affectedUsers: UserProfile[];
  systemMessage: string;
};
