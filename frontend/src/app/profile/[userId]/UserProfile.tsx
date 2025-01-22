"use client"; // TODO: why is this required?
import { getUserProfile, Role } from "./profileApi";
import { useEffect, useState } from "react";

export default function UserProfile({ userId }: { userId: string }) {
  const [selectedRole, setSelectedRole] = useState(Role.STAFF as string);
  const [userProfile, setUserProfile] = useState(getUserProfile(selectedRole));

  useEffect(() => {
    setUserProfile(getUserProfile(selectedRole));
  }, [selectedRole]);

  return (
    <div>
      <header>
        <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}>
          <option value={Role.STAFF}>Staff</option>
          <option value={Role.VOLUNTEER}>Volunteer</option>
        </select>
      </header>
      <h1>Profile page for {selectedRole}</h1>
      <p>{userProfile.role}</p>
    </div>
  );
}
