import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyDomainManagement } from "./SystemOptions/CompanyDomainManagement";
import { JobTypeManagement } from "./SystemOptions/JobTypeManagement";
import { JobLevelManagement } from "./SystemOptions/JobLevelManagement";
import { WorkTypeManagement } from "./SystemOptions/WorkTypeManagement";

export const SystemOptionsPage = () => {
  const [activeTab, setActiveTab] = useState("domains");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-title text-gray-900">
          Quản lý tùy chọn hệ thống
        </h1>
        <p className="text-gray-500 mt-1">
          Quản lý các giá trị dropdown và tùy chọn trong hệ thống
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 h-auto p-2 bg-gray-100/80 rounded-lg">
          <TabsTrigger
            value="domains"
            className="text-base py-2 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Lĩnh vực công ty
          </TabsTrigger>
          <TabsTrigger
            value="jobtypes"
            className="text-base py-2 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Loại công việc
          </TabsTrigger>
          <TabsTrigger
            value="joblevels"
            className="text-base py-2 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Cấp độ
          </TabsTrigger>
          <TabsTrigger
            value="worktypes"
            className="text-base py-2 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Hình thức làm việc
          </TabsTrigger>
        </TabsList>

        <TabsContent value="domains">
          <CompanyDomainManagement />
        </TabsContent>

        <TabsContent value="jobtypes">
          <JobTypeManagement />
        </TabsContent>

        <TabsContent value="joblevels">
          <JobLevelManagement />
        </TabsContent>

        <TabsContent value="worktypes">
          <WorkTypeManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
