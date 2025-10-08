interface ButtonProps {
  label?: string;
  onClick?: () => void;
  outlineColor?: string;
  bgColor?: string;
  textColor?: string;
  textSize?: string;
  paddingX?: string;
  paddingY?: string;
  hoverBgColor?: string;
  disabled?: boolean;
  disabledColor?: string;
  loading?: boolean;
  loadingColor?: string;
  loadingText?: string;
}

export const PrimaryButton = ({
  label = "Primary Button",
  onClick,
  outlineColor,
  bgColor = "bg-gradient-to-r from-[#7749DA] to-[#38128A]",
  hoverBgColor = "hover:bg-gradient-to-r hover:from-[#260C5C] hover:to-[#38128A] cursor-pointer",
  textColor = "text-white",
  paddingX = "px-[20px]",
  paddingY = "py-[10px]",
  disabled = false,
  disabledColor = "bg-gradient-to-r from-[#38128A] to-[#260C5C] cursor-not-allowed",
  loading = false,
  loadingColor = "bg-gradient-to-r from-[#38128A] to-[#260C5C] cursor-progress",
  loadingText = "Loading...",
  textSize = "text-[12px] sm:text-[14px]",
}: ButtonProps) => {
  const buttonClass = `${outlineColor ? outlineColor : ""}
    ${paddingX} ${paddingY} ${textSize}
    ${textColor} rounded-[30px] transition-all duration-500 shadow-[0_4px_4px_#DFD2FA]
    ${disabled ? disabledColor : loading ? loadingColor : bgColor} 
    ${!disabled && !loading ? hoverBgColor : ""}
  `;

  return (
    <button
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled}
      className={buttonClass}
    >
      {loading ? loadingText : label}
    </button>
  );
};

export const OutlineButton = ({
  label = "Primary Button",
  onClick,
  outlineColor = "outline outline-[2px] outline-primary",
  bgColor,
  hoverBgColor = "hover:bg-[#DFD2FA] cursor-pointer",
  textColor = "text-primary",
  paddingX = "px-[20px]",
  paddingY = "py-[10px]",
  disabled = false,
  disabledColor = "bg-[#DFD2FA] cursor-not-allowed",
  loading = false,
  loadingColor = "bg-[#DFD2FA] cursor-progress",
  loadingText = "Loading...",
  textSize = "text-[14px]",
}: ButtonProps) => {
  const buttonClass = `${outlineColor ? outlineColor : ""}
    ${paddingX} ${paddingY} ${textSize}
    ${textColor} rounded-[30px] transition-all duration-500 shadow-[0_4px_4px_#DFD2FA]
    ${disabled ? disabledColor : loading ? loadingColor : bgColor} 
    ${!disabled && !loading ? hoverBgColor : ""}
  `;

  return (
    <button
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled}
      className={buttonClass}
    >
      {loading ? loadingText : label}
    </button>
  );
};
