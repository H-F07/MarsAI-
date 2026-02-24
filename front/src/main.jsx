import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import i18n from "./src/i18n";

import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./styles/index.css";
import Home from "./pages/public/Home.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminUsersPage from "./pages/admin/Users.jsx";
import Submissions from "./pages/admin/Submissions.jsx";
import Moderation from "./pages/admin/Moderation.jsx";
import Leaderboard from "./pages/admin/Leaderboard.jsx";
import Events from "./pages/admin/Events.jsx";
import JuryManagement from "./pages/admin/JuryManagement.jsx";
import Settings from "./pages/admin/Settings.jsx";
import CMS from "./pages/admin/CMS.jsx";
import EditEvent from "./pages/admin/EditEvent.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import PublicLayout from "./layouts/PublicLayout.jsx";
import { Login } from "./pages/auth/Login.jsx";
import { Register } from "./pages/auth/Register.jsx";
import { RoleGuard } from "./middlewares/RoleGuard.jsx";
import Agenda from "./pages/public/Agenda.jsx";
import Discover from "./pages/public/Discover.jsx";
import Competition from "./pages/public/Competition.jsx";
import Profile from "./pages/public/Profile.jsx";
import JuryDashboard from "./pages/admin/JuryDashboard.jsx";
import UploadPage from "./pages/public/Upload.jsx";
import JuryVotePage from "./pages/jury/jury-page.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/competition" element={<Competition />} />
              <Route path="/Agenda" element={<Agenda />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/jury-dashboard" element={<JuryDashboard />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/jury/:filmId" element={<JuryVotePage />} />
            </Route>

            {/* Routes admin */}
            <Route
              path="admin"
              element={
                <RoleGuard allowedRoles={["ADMIN"]}>
                  <AdminLayout />
                </RoleGuard>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="submissions" element={<Submissions />} />
              <Route path="moderation" element={<Moderation />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="events" element={<Events />} />
              <Route path="events/new" element={<EditEvent />} />
              <Route path="events/:id/edit" element={<EditEvent />} />
              <Route path="jury" element={<JuryManagement />} />
              <Route path="settings" element={<Settings />} />
              <Route path="cms" element={<CMS />} />
            </Route>
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </I18nextProvider>
  </StrictMode>,
);
