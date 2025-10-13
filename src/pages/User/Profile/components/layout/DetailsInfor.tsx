import type { User } from "@/types/User";
import { PartTitle } from "../ui/PartTitle";
import { useState, useEffect, useRef } from "react";
import { Github, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";

interface DetailedInformation {
  icon: LucideIcon;
  title: string;
  content: string;
}

export const DetailsInfor = ({ user }: { user: User }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const introduceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = introduceRef.current;
    if (el) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxHeight = lineHeight * 3;
      setIsOverflowing(el.scrollHeight > maxHeight + 1);
    }
  }, [user.introduction]);

  const DetailedInformations: DetailedInformation[] = [
    { icon: Mail, title: "Email", content: user.email },
    { icon: Phone, title: "Số điện thoại", content: user.phoneNumber },
    { icon: Github, title: "Github", content: user.github },
    { icon: MapPin, title: "Địa chỉ", content: user.address },
  ];
  const renderInfor = () => {
    return DetailedInformations.map((infor, index) => {
      const isItemExpanded = expandedIndex === index;

      return (
        <div
          key={infor.title}
          className={`flex flex-row items-center justify-center gap-[10px] w-full cursor-pointer
          ${index % 2 === 0 ? "md:justify-start" : "md:justify-end"}`}
          onClick={() => setExpandedIndex(isItemExpanded ? null : index)}
        >
          <div className="w-[40px] h-[40px] rounded-[10px] bg-[#f8f9fb] flex flex-col items-center justify-center shrink-0">
            <infor.icon size={22} className="text-[#888888]" />
          </div>

          <div className="flex flex-col items-start justify-center w-0 flex-1 overflow-hidden text-ellipsis">
            <div
              className={`text-[15px] font-medium text-black transition-all duration-300 ${
                isItemExpanded
                  ? "line-clamp-none overflow-hidden text-ellipsis"
                  : "overflow-hidden text-ellipsis"
              }`}
            >
              {infor.content}
            </div>
            <div className="text-[12px] font-regular text-[#A6A6A6]">
              {infor.title}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="w-full bg-white rounded-[20px] border-2 border-[#f2f2f2] flex flex-col justify-center items-center px-4 gap-4 relative md:px-10 py-4">
      {/* Phần giới thiệu */}
      <div className="flex flex-col w-full">
        <PartTitle text="Lời giới thiệu" />
        <div
          ref={introduceRef}
          className={`text-[12px] leading-[24px] transition-all text-justify duration-300 pt-4 ${
            isExpanded ? "line-clamp-none" : "line-clamp-3"
          }`}
        >
          {user.introduction}
        </div>

        {isOverflowing && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#5E1EE6] text-[12px] mt-1 self-start font-medium hover:underline text-right w-full"
          >
            {isExpanded ? "Thu gọn" : "Xem thêm"}
          </button>
        )}
      </div>

      {/* Phần thông tin cá nhân */}
      <div className="flex flex-col w-full">
        <PartTitle text="Thông tin cá nhân" />
        <div className="w-full flex flex-col justify-center items-center gap-5 py-4 md:grid md:grid-cols-2 md:justify-between">
          {renderInfor()}
        </div>
      </div>
    </div>
  );
};
