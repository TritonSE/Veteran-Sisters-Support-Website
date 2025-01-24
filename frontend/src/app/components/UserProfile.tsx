"use client"; // TODO: why is this required?
import { getUserProfile, Role } from "../api/profileApi";
import { useEffect, useState } from "react";

export default function UserProfile({ userId }: { userId: string }) {
  const [viewingRole, setViewingRole] = useState(Role.STAFF as string);
  const [veiwerRole, setViewerRole] = useState(Role.STAFF as string);
  const [userProfile, setUserProfile] = useState(getUserProfile(viewingRole));

  useEffect(() => {
    setUserProfile(getUserProfile(viewingRole));
  }, [viewingRole]);

  return (
    <div>
      <label htmlFor="roleViewing">Role Viewing</label>
      <select
        id="roleViewing"
        value={viewingRole}
        onChange={(event) => setViewingRole(event.target.value)}
      >
        <option value={Role.STAFF}>Staff</option>
        <option value={Role.VOLUNTEER}>Volunteer</option>
      </select>
      <label htmlFor="roleViewing">Viewer Role</label>
      <select
        id="roleViewing"
        value={viewingRole}
        onChange={(event) => setViewerRole(event.target.value)}
      >
        <option value={Role.ADMIN}>Admin</option>
      </select>
    </div>
  );
}
