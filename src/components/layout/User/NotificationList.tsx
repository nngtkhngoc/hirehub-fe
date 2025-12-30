import { useEffect, useRef, useState } from "react";
import { useNotifications } from "@/hooks/useNotification";
import { useNotificationActions } from "@/hooks/useNotification";
import type { Notification } from "@/types/Notification";
import { NotificationItem } from "@/components/ui/User/NotificationItem";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Bell } from "lucide-react";

const PAGE_SIZE = 10;

export const NotificationList = () => {
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Notification[]>([]);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { data, isFetching } = useNotifications(page, PAGE_SIZE);
  const { markAsRead, markAllAsRead } = useNotificationActions();

  /* ---------- append data khi page đổi ---------- */
  useEffect(() => {
    if (!data) return;

    setItems((prev) => {
      const existingIds = new Set(prev.map((n) => n.id));
      const newItems = data.content.filter((n) => !existingIds.has(n.id));
      return [...prev, ...newItems];
    });
  }, [data]);

  /* ---------- infinite scroll ---------- */
  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          data &&
          page + 1 < data.totalPages &&
          !isFetching
        ) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [data, isFetching, page]);

  /* ---------- click notification ---------- */
  const handleClick = (noti: Notification) => {
    if (!noti.isRead) {
      markAsRead.mutate(noti.id);
    }

    if (noti.redirectUrl) {
      window.location.href = noti.redirectUrl;
    }
  };

  const hasUnreadNotifications = items.some((item) => !item.isRead);

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow hidden">
      <div className="p-4 border-b font-semibold text-lg">Thông báo</div>

      <div className="max-h-[500px] overflow-y-auto">
        {items.length === 0 && !isFetching ? (
          <div className="py-8">
            <Empty className="border-none">
              <EmptyContent>
                <EmptyMedia variant="icon">
                  <Bell className="text-primary" />
                </EmptyMedia>
                <EmptyTitle className="text-base">Chưa có thông báo</EmptyTitle>
                <EmptyDescription className="text-xs">
                  Bạn chưa có thông báo nào. Các thông báo mới sẽ xuất hiện ở đây.
                </EmptyDescription>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <>
            {items.map((noti) => (
              <NotificationItem
                key={noti.id}
                notification={noti}
                onClick={handleClick}
              />
            ))}

            {/* loader */}
            <div ref={loaderRef} className="h-10" />
          </>
        )}
      </div>

      {isFetching && (
        <div className="text-center text-sm py-2 text-gray-500">
          Đang tải...
        </div>
      )}

      {/* Mark all as read button */}
      {hasUnreadNotifications && items.length > 0 && (
        <div className="p-3 border-t">
          <button
            onClick={handleMarkAllAsRead}
            className="w-full text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Đánh dấu tất cả đã đọc
          </button>
        </div>
      )}
    </div>
  );
};
