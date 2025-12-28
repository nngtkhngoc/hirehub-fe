import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { activateAccount } from "@/apis/auth.api";
import { PrimaryButton } from "@/components/ui/User/Button";
import verify from "@/assets/illustration/verify.png";

export const ActivationPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading"
    );
    const [message, setMessage] = useState("");

    const email = searchParams.get("email");
    const token = searchParams.get("token");

    useEffect(() => {
        const verifyAccount = async () => {
            if (!email || !token) {
                setStatus("error");
                setMessage("Thiếu thông tin email hoặc mã xác thực");
                return;
            }

            try {
                const res = await activateAccount({ email, token });
                setStatus("success");
                setMessage(res.message || "Kích hoạt tài khoản thành công!");
            } catch (error: unknown) {
                setStatus("error");
                const err = error as { response?: { data?: { message?: string } } };
                setMessage(
                    err.response?.data?.message ||
                    "Kích hoạt tài khoản thất bại. Mã có thể đã hết hạn."
                );
            }
        };

        verifyAccount();
    }, [email, token]);

    return (
        <div className="w-full bg-cover bg-center flex items-center justify-center">
            <div className="bg-white/73 px-6 py-20 md:px-8 rounded-[10px] shadow-[-2px_4px_10px_0_#DFD2FA] w-9/10 flex flex-col items-center gap-6 md:w-3/5 lg:w-max-[820px] lg:h-[534px] lg:flex-row justify-center lg:gap-10">
                <div className="flex flex-col justify-center items-center gap-5 lg:flex-row">
                    <div className="bg-white rounded-[10px] shadow-[0_2px_10px_0_#DFD2FA] w-full px-4 sm:px-8 py-10 gap-6 flex flex-col max-w-[400px] items-center">
                        {status === "loading" && (
                            <>
                                <Loader2
                                    size={64}
                                    className="text-primary animate-spin"
                                />
                                <div className="text-center">
                                    <div className="font-bold text-[20px]">
                                        Đang xác thực tài khoản
                                    </div>
                                    <div className="text-[14px] font-light text-[#263238] mt-2">
                                        Vui lòng chờ trong giây lát...
                                    </div>
                                </div>
                            </>
                        )}

                        {status === "success" && (
                            <>
                                <CheckCircle size={64} className="text-green-500" />
                                <div className="text-center">
                                    <div className="font-bold text-[20px] text-green-600">
                                        Xác thực thành công!
                                    </div>
                                    <div className="text-[14px] font-light text-[#263238] mt-2">
                                        {message}
                                    </div>
                                </div>
                                <PrimaryButton
                                    label="Đăng nhập ngay"
                                    onClick={() => navigate("/auth")}
                                />
                            </>
                        )}

                        {status === "error" && (
                            <>
                                <XCircle size={64} className="text-red-500" />
                                <div className="text-center">
                                    <div className="font-bold text-[20px] text-red-600">
                                        Xác thực thất bại
                                    </div>
                                    <div className="text-[14px] font-light text-[#263238] mt-2">
                                        {message}
                                    </div>
                                </div>
                                <PrimaryButton
                                    label="Quay về trang đăng nhập"
                                    onClick={() => navigate("/auth")}
                                />
                            </>
                        )}
                    </div>

                    <img
                        src={verify}
                        alt="verify"
                        className="hidden lg:block lg:w-[360px]"
                    />
                </div>
            </div>
        </div>
    );
};
