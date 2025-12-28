/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SignUpCandidate } from "./SignUpCandidate";
import { SignUpRecruiter } from "./SignUpRecruiter";

export const SignUp = ({
  ref,
  setAuthTab,
}: {
  ref: any;
  setAuthTab: React.Dispatch<React.SetStateAction<"sign-in" | "sign-up">>;
}) => {
  const [typeAccount, setTypeAccount] = useState<"candidate" | "recruiter">(
    "candidate"
  );

  return (
    <div className="bg-white rounded-[10px] shadow-[0_2px_10px_0_#DFD2FA] w-full px-6 md:px-8 py-10 gap-6 flex flex-col">
      <div className="flex flex-col gap-5 text-[14px]">
        {/* Loại tài khoản */}
        <div className="flex flex-col gap-3 w-full">
          <label className="font-semibold">Loại tài khoản:</label>

          <RadioGroup
            value={typeAccount}
            onValueChange={(value) =>
              setTypeAccount(value as "candidate" | "recruiter")
            }
            className="w-full flex flex-row justify-between items-center"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="candidate"
                id="candidate"
                className="border-[#DFD2FA] data-[state=checked]:border-[#5E1EE6]"
              />
              <label htmlFor="candidate" className="text-[13px] font-normal">
                Cá nhân
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="recruiter"
                id="recruiter"
                className="border-[#DFD2FA] data-[state=checked]:border-[#5E1EE6]"
              />
              <label htmlFor="recruiter" className="text-[13px] font-normal">
                Doanh nghiệp
              </label>
            </div>
          </RadioGroup>
        </div>

        {typeAccount == "candidate" ? (
          <SignUpCandidate ref={ref} setAuthTab={setAuthTab} />
        ) : (
          <SignUpRecruiter ref={ref} setAuthTab={setAuthTab} />
        )}
      </div>

      {/* Buttons */}
    </div>
  );
};
