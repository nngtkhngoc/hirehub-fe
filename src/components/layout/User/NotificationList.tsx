import { useEffect, useRef, useState } from "react";
import { useNotifications } from "@/hooks/useNotification";
import { useNotificationActions } from "@/hooks/useNotification";
import type { Notification } from "@/types/Notification";
import { NotificationItem } from "@/components/ui/User/NotificationItem";

const PAGE_SIZE = 10;

export const NotificationList = () => {
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Notification[]>([]);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { data, isFetching } = useNotifications(page, PAGE_SIZE);
  const { markAsRead } = useNotificationActions();

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

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow">
      <div className="p-4 border-b font-semibold text-lg">Thông báo</div>

      <div className="max-h-[500px] overflow-y-auto">
        {items.map((noti) => (
          <NotificationItem
            key={noti.id}
            notification={noti}
            onClick={handleClick}
          />
        ))}

        {/* loader */}
        <div ref={loaderRef} className="h-10" />
      </div>

      {isFetching && (
        <div className="text-center text-sm py-2 text-gray-500">
          Đang tải...
        </div>
      )}
    </div>
  );
};
