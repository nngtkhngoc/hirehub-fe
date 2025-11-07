export const SideTitle = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-row justify-between items-center w-full md:pr-5 py-5 border-b border-[#A6A6A6]">
      <div className="font-bold text-[16px]">{text}</div>
    </div>
  );
};
