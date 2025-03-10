"use client";
import Link from "next/link";

import { NavBar } from "./components/NavBar";

export default function Home() {
  return (
    <>
      <div>
        <NavBar />
        <Link style={{ marginLeft: 100 }} href="/veteranDashboard">
          To Veteran Dashboard
        </Link>
        <Link style={{ marginLeft: 100 }} href="/profile/67a54f72a44631441561e216">
          To Veteran Profile
        </Link>
      </div>
    </>
  );
}
