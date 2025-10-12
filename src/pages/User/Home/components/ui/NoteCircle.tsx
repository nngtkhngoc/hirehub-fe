export const NoteCircle = ({ text }: { text: string }) => {
  return (
    <div className="bg-gradient-to-r from-[#7E4BEB] via-[#4B18B8] to-[#38128A] text-secondary font-bold font-[16px] px-[20px] py-[5px] rounded-[30px]">
      {text}
    </div>
  );
};
