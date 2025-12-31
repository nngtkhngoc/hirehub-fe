import { useState } from "react";
import { Category } from "./components/layout/Category";
import { ConnectionList } from "./components/layout/ConnectionList";

export const MyConnectionsPage = () => {
  const [categoryTab, setCategoryTab] = useState<"friends" | "requests">(
    "friends"
  );

  return (
    <div className="pt-[100px] pb-[50px] flex flex-col md:flex-row items-center justify-center gap-3 w-full px-5 md:items-start md:gap-10 md:px-10 lg:pr-50 w-full">
      <div className="w-full md:w-1/2">
        <Category categoryTab={categoryTab} setCategoryTab={setCategoryTab} />
      </div>
      <div className="w-full">
        <ConnectionList categoryTab={categoryTab} />
      </div>
    </div>
  );
};

