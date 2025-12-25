import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import "./index.css";

import { UserLayout } from "./components/layout/User/UserLayout.tsx";
import { HomePage } from "./pages/User/Home/HomePage.tsx";
import { AuthPage } from "./pages/User/Auth/AuthPage.tsx";
import { AuthLayout } from "./components/layout/User/AuthLayout.tsx";
import { VerifyPage } from "./pages/User/Verify/VerifyPage.tsx";
import { ForgetPasswordPage } from "./pages/User/ForgetPassword/ForgetPasswordPage.tsx";
import { MailSentPage } from "./pages/User/MailSent/MailSentPage.tsx";
import { JobListPage } from "./pages/User/JobList/JobListPage.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CompanyListPage } from "./pages/User/CompanyList/CompanyListPage.tsx";
import { UserListPage } from "./pages/User/UserList/UserListPage.tsx";
import { ProfilePage } from "./pages/User/Profile/ProfilePage.tsx";
import { ResetPasswordPage } from "./pages/User/ResetPassword/ResetPasswordPage.tsx";
import { User } from "./pages/User/User/User.tsx";
import { JobDetails } from "./pages/User/JobDetails/JobDetails.tsx";
import { MyJobsPage } from "./pages/User/MyJobs/MyJobsPage.tsx";
import { ChatboxPage } from "./pages/User/Chat/ChatboxPage.tsx";
import { ChatRedirectPage } from "./pages/User/Chat/ChatRedirectPage.tsx";

// Admin imports
import { AdminLayout } from "./components/layout/Admin/AdminLayout.tsx";
import { AdminDashboardPage } from "./pages/Admin/AdminDashboardPage.tsx";
import { UserManagementPage } from "./pages/Admin/UserManagementPage.tsx";
import { JobManagementPage } from "./pages/Admin/JobManagementPage.tsx";
import { ViolationManagementPage } from "./pages/Admin/ViolationManagementPage.tsx";
import { ResumeManagementPage } from "./pages/Admin/ResumeManagementPage.tsx";

// Recruiter imports
import { RecruiterLayout } from "./components/layout/Recruiter/RecruiterLayout.tsx";
import { RecruiterDashboard } from "./pages/Recruiter/RecruiterDashboard.tsx";
import { JobPostingsPage } from "./pages/Recruiter/JobPostingsPage.tsx";
import { CreateJobPage } from "./pages/Recruiter/CreateJobPage.tsx";
import { CandidatesPage } from "./pages/Recruiter/CandidatesPage.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/job-list" element={<JobListPage />} />
          <Route path="/company-list" element={<CompanyListPage />} />
          <Route path="/user-list" element={<UserListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/user/:userId" element={<User />} />
          <Route path="/job-details/:id" element={<JobDetails />} />{" "}
          <Route path="/my-jobs" element={<MyJobsPage />} />
        </Route>
        <Route path="/chat" element={<ChatRedirectPage />} />
        <Route
          path="/chat/conversation/:conversationId"
          element={<ChatboxPage />}
        />
        <Route path="/chat/:id" element={<ChatboxPage />} />

        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<AuthPage />} />
          <Route path="/auth/verify" element={<VerifyPage />} />
          <Route
            path="/auth/forget-password"
            element={<ForgetPasswordPage />}
          />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/mail-sent" element={<MailSentPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="jobs" element={<JobManagementPage />} />
          <Route path="resumes" element={<ResumeManagementPage />} />
          <Route path="violations" element={<ViolationManagementPage />} />
        </Route>

        {/* Recruiter Routes */}
        <Route path="/recruiter" element={<RecruiterLayout />}>
          <Route index element={<RecruiterDashboard />} />
          <Route path="jobs" element={<JobPostingsPage />} />
          <Route path="jobs/create" element={<CreateJobPage />} />
          <Route path="candidates" element={<CandidatesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
  // </StrictMode>
);
