import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";
import { useAuthStore } from "@/stores/useAuthStore";
import { useParams } from "react-router";
import { ImagePreviewDialog } from "../ui/ImagePreviewDialog";

export default function MediaDetail({
  view,
  setView,
}: {
  view: "default" | "image" | "file";
  setView: (view: "default" | "image" | "file") => void;
}) {
  const [tab, setTab] = useState(view);
  const user = useAuthStore((state) => state.user);
  const { conversationId } = useParams();
  const userId = parseInt(user?.id || "0");
  const [messageTypes, setMessageTypes] = useState<string[]>([view]);

  const message = useChat(
    conversationId ? parseInt(conversationId) : 0,
    userId,
    messageTypes
  );

  const [previewImage, setPreviewImage] = useState<{
    url: string;
    name: string;
  } | null>(null);

  return (
    <div className="flex flex-col items-center gap-5 bg-white border border-zinc-300 rounded-xl bg-white h-full">
      <div className="font-bold text-2xl pt-5 px-5 text-left w-full flex items-center gap-3">
        <ArrowLeft onClick={() => setView("default")} />
        Hình ảnh và files
      </div>
      <div className="font-semi text-lg pt-5 text-left w-full flex items-center gap-3">
        <p
          className={cn(
            "px-5 border-b-2 border-b-transparent",
            tab == "image" && "border-b-2 border-b-primary"
          )}
          onClick={() => {
            setTab("image");
            setMessageTypes(["image"]);
          }}
        >
          Hình ảnh
        </p>
        <p
          className={cn(
            "px-5 border-b-2 border-b-transparent  text-lg ",
            tab == "file" && "border-b-2 border-b-primary"
          )}
          onClick={() => {
            setTab("file");
            setMessageTypes(["file"]);
          }}
        >
          Files
        </p>
      </div>
      {tab === "image" && (
        <div className="grid grid-cols-4">
          {message.data &&
            message.data.map(
              (msg: any) =>
                msg.type === "image" && (
                  <img
                    key={msg.id}
                    src={msg.content}
                    className="m-2 w-24 h-24 object-cover cursor-pointer hover:brightness-90 transition-all rounded-lg"
                    onClick={() =>
                      setPreviewImage({
                        url: msg.content,
                        name: msg.fileName || "image",
                      })
                    }
                  />
                )
            )}
        </div>
      )}
      {tab === "file" && (
        <div>
          {message.data &&
            message.data.map(
              (msg: any) =>
                msg.type === "file" && (
                  <div
                    key={msg.id}
                    className="m-2 p-2 border border-zinc-300 rounded-lg w-60"
                  >
                    <a
                      href={msg.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {msg.content.split("/").pop()}
                    </a>
                  </div>
                )
            )}
        </div>
      )}
      <ImagePreviewDialog
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage?.url || ""}
        imageName={previewImage?.name || ""}
      />
    </div>
  );
}
