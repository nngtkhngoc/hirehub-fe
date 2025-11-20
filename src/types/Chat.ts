import type { UserProfile } from "./Auth";

export type Message = {
  id?: string;
  message: string;
  createdAt: string;
  sender: UserProfile | undefined | null;
  receiver: UserProfile | undefined | null;
  seenUsers: UserProfile[];
};
