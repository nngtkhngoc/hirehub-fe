import type { UserProfile } from "@/types/Auth";
import profile from "@/assets/illustration/profile.png";
import {
  ChevronDown,
  ChevronUp,
  Files,
  Folders,
  Images,
  Settings,
  UserCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";

export const UserDetail = ({
  receiver,
}: {
  receiver: UserProfile | undefined;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5 bg-white border border-zinc-300 rounded-xl bg-white h-[550px] py-5">
      <img
        src={receiver?.avatar || profile}
        className="h-25 w-25 rounded-full object-cover object-center"
      />
      <div className="font-bold text-xl">{receiver?.name}</div>
      <div className="flex flex-col items-center text-sm w-full px-2">
        <div className=" w-full flex flex-row items-center gap-2 justify-left py-3 rounded-xl hover:bg-zinc-100 px-3 cursor-pointer">
          <UserCircleIcon strokeWidth="1.4" />
          Xem trang cá nhân
        </div>
        <div className=" w-full flex flex-row items-center gap-2 justify-left py-3 rounded-xl hover:bg-zinc-100 px-3 cursor-pointer">
          <Settings strokeWidth="1.4" />
          Tùy chỉnh đoạn chat
        </div>
        <Collapsible
          className=" w-full flex flex-col items-center justify-left"
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <CollapsibleTrigger asChild>
            <div className=" w-full flex flex-row items-center gap-2 justify-between rounded-xl hover:bg-zinc-100 py-3 px-3 cursor-pointer">
              <div className="flex flex-row items-center gap-2 justify-center">
                <Folders strokeWidth="1.4" />
                Hình ảnh & Files
              </div>
              {isOpen ? (
                <ChevronUp className="w-5" />
              ) : (
                <ChevronDown className="w-5" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className=" w-full flex flex-col items-center justify-left px-3">
            <div className=" w-full flex flex-row items-center gap-2 justify-left py-3 rounded-xl hover:bg-zinc-100 px-3 cursor-pointer">
              <Images strokeWidth="1.4" />
              Hình ảnh
            </div>
            <div className=" w-full flex flex-row items-center gap-2 justify-left py-3 rounded-xl hover:bg-zinc-100 px-3 cursor-pointer">
              <Files strokeWidth="1.5" />
              File
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
