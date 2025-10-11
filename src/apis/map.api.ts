import type { Province } from "@/types/Province";
import axios from "axios";

export const getAllProvinces = async (): Promise<Province[]> => {
  const res = await axios.get("https://provinces.open-api.vn/api/v2/", {
    withCredentials: false,
  });

  console.log(res);
  return res.data;
};
