// Map đúng với enum NotificationType bên backend
export type NotificationType =
  | "FRIEND_REQUEST"
  | "FRIEND_ACCEPTED"
  | "FRIEND_REJECTED"
  | "SYSTEM"
  | "MESSAGE";

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  content: string;
  redirectUrl?: string | null;

  isRead: boolean;
  isDeleted: boolean;

  createdAt: string; // ISO string từ backend
}

/**
 * Dùng khi tạo notification (admin / system / service nội bộ)
 */
export interface CreateNotificationDTO {
  userId: number;
  type: NotificationType;
  title: string;
  content: string;
  redirectUrl?: string;
}
