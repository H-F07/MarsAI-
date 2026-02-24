import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./styles/index.css";
import Home from "./pages/public/Home.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
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


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
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
          </Route>

          {/* Routes privées */}
          <Route
            path="admin"
            element={
              <RoleGuard allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </RoleGuard>
            }
          >
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
