"use client";

import { AdminDashboard } from "./components/AdminDashboard";
import { NavBar } from "./components/NavBar";
import { StaffDashboard } from "./components/StaffDashboard";
import { VeteranDashboard } from "./components/VeteranDashboard";
import { VolunteerDashboard } from "./components/VolunteerDashboard";
import { useAuth } from "./contexts/AuthContext";
import { AuthContextWrapper } from "./contexts/AuthContextWrapper";

export default function Home() {
  const { userId, userRole } = useAuth();

  return (
    <AuthContextWrapper>
      <NavBar />
      {userRole === "admin" ? (
        <AdminDashboard adminId={userId} />
      ) : userRole === "staff" ? (
        <StaffDashboard staffId={userId} />
      ) : userRole === "volunteer" ? (
        <VolunteerDashboard volunteerId={userId} />
      ) : (
        <VeteranDashboard />
      )}
    </AuthContextWrapper>
  );
}
