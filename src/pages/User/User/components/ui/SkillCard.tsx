export const SkillCard = ({ text }: { text: string }) => {
  return (
    <div className="rounded-[10px] border-2 boder-[#CCCCCC] h-[40px] px-[8px] font-medium text-[14px] flex flex-row items-center justify-center">
      {text}
    </div>
  );
};
