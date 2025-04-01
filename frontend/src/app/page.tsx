"use client";

import { AdminDashboard } from "./components/AdminDashboard";
import { NavBar } from "./components/NavBar";
import { StaffDashboard } from "./components/StaffDashboard";
import { VeteranDashboard } from "./components/VeteranDashboard";
import { VolunteerDashboard } from "./components/VolunteerDashboard";
import { useAuth } from "./contexts/AuthContext";

export default function Home() {
  const { userId, userRole } = useAuth();

  return (
    <div>
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
    </div>
  );
}
