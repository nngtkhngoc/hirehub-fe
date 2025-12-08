import type { UserProfile } from "./Auth";

export type SeenUser = {
  id?: string;
  email?: string;
  emoji?: string;
};

export type Message = {
  id?: string;
  content?: string;
  type?: string;
  createdAt: string;
  sender: UserProfile | undefined | null;
  receiver: UserProfile | undefined | null;
  seenUsers: (SeenUser | undefined)[];
};

export type CreateMessageRequest = {
  content?: string;
  type?: string;

  senderEmail?: string;
  receiverEmail?: string;
};
