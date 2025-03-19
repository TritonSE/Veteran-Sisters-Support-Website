"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AdminDashboard } from "./components/AdminDashboard";
import { NavBar } from "./components/NavBar";
import { StaffDashboard } from "./components/StaffDashboard";
import { VeteranDashboard } from "./components/VeteranDashboard";
import { VolunteerDashboard } from "./components/VolunteerDashboard";

export default function Home() {
  // const userId = "679349548551c0a2c44eeb86"; // ADMIN
  // const role = "admin";
  // const userId = "6793496e8551c0a2c44eeb87"; // STAFF
  // const role = "staff";
  const userId = "67971ace5917b2ea3e4eeb86"; // VOLUNTEER
  const role = "volunteer";
  // const userId = "67bbd461c4c7800e274eeb8a"; // VETERAN
  // const role = "veteran";
  const router = useRouter();

  useEffect(() => {
    switch (role) {
      case "admin":
        break;
      case "staff":
        break;
      case "volunteer":
        break;
      case "veteran":
        break;
      default:
        router.push("/login");
    }
  });

  return (
    <div>
      <NavBar userId={userId} />
      {role === "admin" ? (
        <AdminDashboard adminId={userId} />
      ) : role === "staff" ? (
        <StaffDashboard staffId={userId} />
      ) : role === "volunteer" ? (
        <VolunteerDashboard volunteerId={userId} />
      ) : (
        <VeteranDashboard veteranId={userId} />
      )}
    </div>
  );
}
