import mailsent from "@/assets/illustration/mailsent.png";

export const MailSentPage = () => {
  return (
    <div className="w-full bg-cover bg-center flex items-center justify-center ">
      <div className="bg-white/73 px-6 py-20 md:px-8 rounded-[10px] shadow-[ -2px_4px_10px_0_#DFD2FA ] w-9/10 flex flex-col items-center gap-6 md:w-3/5 lg:w-max-[820px] lg:h-[534px] justify-center lg:gap-10">
        <div className="flex flex-col justify-center items-center gap-15 lg:flex-row">
          <div className="bg-white rounded-[10px] shadow-[0_2px_10px_0_#DFD2FA] w-full px-8 sm:px-8 py-10 gap-6 flex flex-col max-w-[370px] items-center justify-center">
            <img
              src={mailsent}
              alt="sent mail successfully"
              className="w-fit h-fit"
            />
            <div className="font-bold text-[20px] text-center whitespace-nowrap">
              Mail đã được gửi thành công!
            </div>
            <div className="text-[12px] font-light text-[#263238] text-center">
              Vui lòng check mail để chuyển sang bước tiếp theo{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
