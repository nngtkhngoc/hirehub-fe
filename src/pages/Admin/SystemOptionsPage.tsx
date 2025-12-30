import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyDomainManagement } from "./SystemOptions/CompanyDomainManagement";
import { JobTypeManagement } from "./SystemOptions/JobTypeManagement";
import { JobLevelManagement } from "./SystemOptions/JobLevelManagement";
import { WorkTypeManagement } from "./SystemOptions/WorkTypeManagement";
import { Settings } from "lucide-react";

export const SystemOptionsPage = () => {
  const [activeTab, setActiveTab] = useState("domains");

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Quản lý tùy chọn hệ thống</h1>
        </div>
        <p className="text-muted-foreground">
          Quản lý các giá trị dropdown và tùy chọn trong hệ thống
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="domains">Lĩnh vực công ty</TabsTrigger>
          <TabsTrigger value="jobtypes">Loại công việc</TabsTrigger>
          <TabsTrigger value="joblevels">Cấp độ</TabsTrigger>
          <TabsTrigger value="worktypes">Hình thức làm việc</TabsTrigger>
        </TabsList>

        <TabsContent value="domains">
          <Card>
            <CardHeader>
              <CardTitle>Lĩnh vực công ty</CardTitle>
              <CardDescription>
                Quản lý các lĩnh vực hoạt động của công ty
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyDomainManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobtypes">
          <Card>
            <CardHeader>
              <CardTitle>Loại công việc</CardTitle>
              <CardDescription>
                Quản lý các loại hình công việc (Full-time, Part-time, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JobTypeManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="joblevels">
          <Card>
            <CardHeader>
              <CardTitle>Cấp độ công việc</CardTitle>
              <CardDescription>
                Quản lý các cấp độ kinh nghiệm (Intern, Junior, Senior, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JobLevelManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="worktypes">
          <Card>
            <CardHeader>
              <CardTitle>Hình thức làm việc</CardTitle>
              <CardDescription>
                Quản lý hình thức làm việc (Remote, Hybrid, Onsite, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkTypeManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

