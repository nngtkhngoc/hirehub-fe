export const HighlightText = ({ text }: { text: string }) => {
  return (
    <span className="whitespace-nowrap w-max px-1 relative before:w-full text-primary text-[25px] sm:text-[30px] font-extrabold md:text-[35px] xl:text-[48px] before:h-1/3 before:bg-secondary before:absolute before:bottom-0.5 before:left-0 z-10 before:-z-3">
      {text}
    </span>
  );
};
