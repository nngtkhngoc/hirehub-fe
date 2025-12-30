/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useRef, useMemo } from "react";
import { useStomp } from "@/hooks/useStomp";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChat, useChatList } from "@/hooks/useChat";
import type { Message, Conversation, GroupEventData } from "@/types/Chat";
import profile from "@/assets/illustration/profile.png";
import { Files, Images, Send, SmilePlus, Users } from "lucide-react";
import Picker from "emoji-picker-react";
import { uploadFile } from "@/apis/chat.api";
import { markConversationAsRead } from "@/apis/conversation.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { ImagePreviewDialog } from "../ui/ImagePreviewDialog";

export const Chatbox = ({
  conversation,
}: {
  conversation: Conversation | undefined;
}) => {
  const inputRef = useRef<any>(null);
  const {
    connected,
    subscribePrivateMessage,
    sendMessage,
    subscribeSeenMessage,
    sendSeen,
    subscribeReactMessage,
    sendReact,
    subscribeGroupEvent,
  } = useStomp();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const conversationId = conversation?.id;
  const userId = user?.id ? parseInt(user.id) : 0;

  const { data: history, refetch } = useChat(conversationId || 0, userId);

  const { refetch: refetchChatList } = useChatList(userId);
  const [messages, setMessages] = useState<Message[]>([]);

  // Mark conversation as read when opening
  const markAsReadMutation = useMutation({
    mutationFn: ({
      conversationId,
      userId,
    }: {
      conversationId: number;
      userId: number;
    }) => markConversationAsRead(conversationId, userId),
    onSuccess: () => {
      refetchChatList();
    },
  });

  useEffect(() => {
    if (conversationId && userId) {
      markAsReadMutation.mutate({ conversationId, userId });
    }
  }, [conversationId]);

  useEffect(() => {
    if (history) setMessages(history);
  }, [history]);

  // SEND MSG
  useEffect(() => {
    if (!connected || !conversationId) return;
    const sub = subscribePrivateMessage(() => {
      refetch();
      refetchChatList();
    });
    return () => sub && sub.unsubscribe();
  }, [connected, conversationId, user?.email]);

  const handleSend = () => {
    const content = inputRef.current.value.trim();
    if (!content || !user?.email || !conversationId) return;

    sendMessage({
      senderEmail: user?.email,
      conversationId: conversationId,
      content: content,
      type: "text",
    });
    inputRef.current.value = "";
    refetchChatList();
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversationId) return;

    const url = await uploadFile(file);

    const isImage = file.type.startsWith("image/");
    sendMessage({
      senderEmail: user?.email!,
      conversationId: conversationId,
      fileName: file.name,
      content: url,
      type: isImage ? "image" : "file",
    });

    e.target.value = "";
  };

  // REACT MSG
  useEffect(() => {
    if (!connected) return;

    const sub = subscribeReactMessage(() => {
      refetch();
      refetchChatList();
    });

    return () => sub?.unsubscribe();
  }, [connected]);

  const handleEmojiPicked = (emoji: string, msgId: string | undefined) => {
    if (!emoji || !user?.id) return;

    sendReact({
      userId: parseInt(user?.id!),
      messageId: msgId && parseInt(msgId),
      emoji,
    });
    setOpenPickerFor("");
  };

  useEffect(() => {
    if (!connected) return;

    const sub = subscribeSeenMessage(() => {
      refetch();
      refetchChatList();
    });

    return () => sub?.unsubscribe();
  }, [connected]);

  // SUBSCRIBE TO GROUP EVENTS (kick, leave, invite)
  useEffect(() => {
    if (!connected) return;

    const sub = subscribeGroupEvent((eventData: GroupEventData) => {
      // Refetch chat list và history
      refetch();
      refetchChatList();

      // Invalidate conversation queries để cập nhật participants
      queryClient.invalidateQueries({ queryKey: ["chat-list"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (conversationId) {
        queryClient.invalidateQueries({
          queryKey: ["conversation", conversationId.toString(), userId],
        });
      }

      // Nếu user hiện tại bị kick hoặc rời nhóm, chuyển sang conversation khác
      const isCurrentUserAffected = eventData.affectedUsers?.some(
        (u) => String(u.id) === String(userId) || String(u.id) === String(user?.id)
      );

      if (
        isCurrentUserAffected &&
        (eventData.eventType === "MEMBER_KICKED" ||
          eventData.eventType === "MEMBER_LEFT" ||
          eventData.eventType === "GROUP_DISBANDED")
      ) {
        // Refetch chat list trước rồi chuyển sang conversation khác
        refetchChatList().then((result) => {
          const conversations = result.data;
          if (conversations && conversations.length > 0) {
            // Tìm conversation khác (không phải conversation hiện tại và có tin nhắn)
            const otherConversation = conversations.find(
              (c: any) => c.id !== conversationId && c.lastMessage != null
            );
            if (otherConversation) {
              navigate(`/chat/conversation/${otherConversation.id}`, {
                replace: true,
              });
            } else {
              // Không có conversation khác có tin nhắn, chuyển về trang chat chính
              navigate("/chat", { replace: true });
            }
          } else {
            navigate("/chat", { replace: true });
          }
        });
      }
    });

    return () => sub?.unsubscribe();
  }, [connected, conversationId, userId, user?.id]);

  // For group chat, check if all participants have seen
  const isSeen = useMemo(() => {
    if (!conversation || !messages.length) return false;

    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.sender?.id !== user?.id) return false;

    if (conversation.type === "DIRECT") {
      const otherUser = conversation.participants.find(
        (p) => p.id !== user?.id
      );
      return lastMsg.seenUsers?.some((u) => u?.id == otherUser?.id) || false;
    }

    // For group, check if all participants have seen
    const participantsCount = conversation.participants.length;
    const seenCount = lastMsg.seenUsers?.length || 0;
    return seenCount >= participantsCount - 1; // -1 because sender doesn't count
  }, [conversation, user, messages]);

  const lastMsgRef = useRef<string | null>(null);

  useEffect(() => {
    if (!messages.length || !connected || !user?.id) return;

    const lastMsg = messages[messages.length - 1];

    // Mark as seen if message is not from current user and not already seen
    if (
      lastMsg.sender?.id !== user?.id &&
      lastMsg.id !== lastMsgRef.current &&
      !lastMsg.seenUsers?.some((u) => u?.id == user?.id)
    ) {
      lastMsgRef.current = lastMsg.id ?? null;

      sendSeen({
        userId: parseInt(user?.id!),
        messageId: parseInt(lastMsg.id!),
      });
    }
  }, [messages, connected, user?.id]);

  const [openPickerFor, setOpenPickerFor] = useState<string | null>(null);

  const togglePicker = (msgId?: string) => {
    if (openPickerFor === msgId) {
      setOpenPickerFor(null);
    } else {
      setOpenPickerFor(msgId || null);
    }
  };
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    name: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messages.length === 0) return;

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Get display name and avatar for header
  const displayInfo = useMemo(() => {
    if (!conversation) return { name: "", avatar: profile };

    if (conversation.type === "GROUP") {
      return {
        name: conversation.name || "Nhóm chat",
        avatar:
          conversation.participants.find((p) => p.id !== user?.id)?.avatar ||
          profile,
      };
    }

    const otherUser = conversation.participants.find((p) => p.id !== user?.id);
    return {
      name: otherUser?.name || "Người dùng",
      avatar: otherUser?.avatar || profile,
    };
  }, [conversation, user?.id]);

  if (!conversation) {
    return (
      <div className="w-full max-h-full flex flex-col border border-zinc-300 rounded-xl bg-white overflow-hidden items-center justify-center">
        <p className="text-zinc-500">Chọn một cuộc trò chuyện để bắt đầu</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col border border-zinc-300 rounded-xl bg-white overflow-hidden ">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-200 p-4 bg-zinc-50 rounded-t-xl h-[62px]">
        <div className="relative">
          <img
            src={displayInfo.avatar}
            alt={displayInfo.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {conversation.type === "GROUP" && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <Users className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-zinc-800">
            {displayInfo.name}
          </span>
          <span className="text-xs text-zinc-500">
            {conversation.type === "GROUP"
              ? `${conversation.participants.length} thành viên`
              : "Đang trò chuyện"}
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
        {messages?.map((m, idx) => {
          const isMine = m?.sender?.id === user?.id;
          const isSystemMessage = m.type === "system";

          // Render system message (kick, leave, invite notifications)
          if (isSystemMessage) {
            return (
              <div key={m?.id} className="flex justify-center my-2">
                <div className="bg-zinc-100 text-zinc-500 text-xs px-3 py-1.5 rounded-full">
                  {m.content}
                </div>
              </div>
            );
          }

          return (
            <div
              key={m?.id}
              className="flex flex-row items-start justify-start group relative"
            >
              <div
                className={`flex flex-col relative gap-2 ${isMine ? "text-right ml-auto" : "text-left mr-auto"
                  }`}
              >
                {/* Show sender name in group chat */}
                {conversation.type === "GROUP" && !isMine && (
                  <span className="text-xs text-zinc-500 mb-1">
                    {m.sender?.name || "Người dùng"}
                  </span>
                )}
                {/* Message bubble */}
                <div
                  className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"
                    }`}
                >
                  {!isMine && (
                    <img
                      src={m.sender?.avatar || profile}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  {isMine && (
                    <button
                      onClick={() => togglePicker(m.id)}
                      className="w-6 h-6 items-center justify-center rounded-full hover:bg-zinc-100 transition hidden group-hover:flex cursor-pointer absolute -left-8"
                    >
                      <SmilePlus className="w-4 h-4" />
                    </button>
                  )}
                  {m.type === "text" && (
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-sm whitespace-pre-wrap break-words max-w-xs md:max-w-md ${isMine
                        ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-br-none shadow-md"
                        : "bg-zinc-200 text-zinc-800 rounded-bl-none"
                        }`}
                    >
                      <span>{m.content}</span>
                    </div>
                  )}

                  {m.type === "image" && (
                    <img
                      src={m.content}
                      className="rounded-2xl max-w-[220px] w-full h-auto cursor-pointer border border-zinc-200 object-contain hover:brightness-95 transition-all"
                      alt="img"
                      onClick={() =>
                        setPreviewImage({
                          url: m.content!,
                          name: m.fileName || "image",
                        })
                      }
                    />
                  )}

                  {m.type === "file" && (
                    <a
                      href={m.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
    flex items-center gap-3 p-3 rounded-xl border border-transparent
    cursor-pointer max-w-[260px] shadow-sm
    transition-all duration-300
    ${isMine
                          ? "bg-gradient-to-r from-indigo-100 to-purple-100 hover:brightness-105"
                          : "bg-gradient-to-r from-rose-100 via-orange-100 to-amber-100 hover:brightness-105"
                        }
  `}
                    >
                      {/* File icon */}
                      <div
                        className={`
      w-10 h-10 flex items-center justify-center
      rounded-lg text-zinc-700 font-bold ${isMine ? "bg-violet-200" : "bg-zinc-200 "
                          }`}
                      >
                        <Files
                          className={` ${isMine ? "text-primary" : "text-zinc-800 "
                            }`}
                        />
                      </div>

                      {/* File info */}
                      <div className="flex flex-col gap-1 justify-left items-start">
                        <span className="font-medium text-sm text-zinc-800 line-clamp-1">
                          {m.fileName || "File đính kèm"}
                        </span>
                        <span className="text-xs text-zinc-500">
                          Nhấn để mở
                        </span>
                      </div>
                    </a>
                  )}

                  {/* Hover emoji button */}
                  {!isMine && (
                    <button
                      onClick={() => togglePicker(m.id)}
                      className="w-6 h-6 items-center justify-center rounded-full hover:bg-zinc-100 transition hidden group-hover:flex hover:cursor-pointer absolute -right-8"
                    >
                      <SmilePlus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {/* Seen emojis */}
                {m?.seenUsers?.length > 0 && (
                  <div
                    className={`flex flex-wrap gap-1 -mt-3  justify-end
                    }`}
                  >
                    {m.seenUsers.map((e, i) =>
                      e?.emoji ? (
                        <span
                          key={i}
                          className="w-6 h-6 text-lg bg-white border rounded-full shadow-sm flex items-center justify-center"
                        >
                          {e.emoji}
                        </span>
                      ) : null
                    )}
                  </div>
                )}
                {/* Emoji picker */}
                {openPickerFor === m.id && (
                  <div
                    className={`absolute z-50 bottom-10 ${isMine ? "right-0" : "left-0"
                      }`}
                  >
                    <Picker
                      onEmojiClick={(e) => handleEmojiPicked(e.emoji, m?.id)}
                      reactionsDefaultOpen={true}
                      style={{
                        transform: "scale(0.8)",
                        transformOrigin: "bottom right",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        borderRadius: "12px",
                      }}
                    />
                  </div>
                )}
                {/* Seen / Sent indicator */}
                <div className="absolute -bottom-5 right-0 text-[10px] text-zinc-400 flex items-end justify-end">
                  {idx === messages.length - 1 && isMine && (
                    <span>{isSeen ? "Đã xem" : "Đã gửi"}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <div className="p-4 border-t border-zinc-200 flex items-center gap-3 bg-zinc-50 rounded-b-xl text-sm">
        <button
          className="p-2 border-zinc-200 border-1 hover:border-zinc-400 text-black rounded-full transition-all duration-500 cursor-pointer"
          onClick={handleSelectFile}
        >
          <Images />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        <input
          ref={inputRef}
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-4 py-2 rounded-full border border-zinc-300 focus:outline-none bg-white focus:ring-1 focus:ring-primary focus:border-transparent"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          onClick={handleSend}
          className="p-2 bg-gradient-to-r from-purple-600 to-violet-900  hover:from-purple-800 hover:to-violet-900 text-white rounded-full hover:bg-blue-700 active:scale-95 transition cursor-pointer"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      <ImagePreviewDialog
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage?.url || ""}
        imageName={previewImage?.name || ""}
      />
    </div>
  );
};
