export const NumberCircle = ({ number }: { number: string }) => {
  return (
    <div className="w-[47px] h-[47px] rounded-full text-16px text-[#F2F2F2] font-semibold bg-secondary shadow-[0_4px_10px_rgba(0,0,0,0.25)] flex items-center justify-center">
      {number}
    </div>
  );
};
