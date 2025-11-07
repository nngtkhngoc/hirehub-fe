export const LanguageCard = ({ language }: { language: any }) => {
  console.log(language, "language card");
  return (
    <div className="flex flex-row gap-2 items-center justify-left border boder-[#dfdfdf] rounded-[10px] min-w-[200px] min-h-[70px] gap-5 px-5">
      <div className="w-[44px] h-[44px] bg-black text-white rounded-full flex items-center justify-center">
        {language.language.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex flex-col items-start justify-left gap-0.5">
        <div className="font-bold text-[14px]">{language.name}</div>
        <div className="text-[12px] text-[#888888]">{language.level}</div>
      </div>
    </div>
  );
};
