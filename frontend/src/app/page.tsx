"use client";
import { useEffect } from "react";
// import Link from "next/link";

import { useAuth } from "../contexts/AuthContext";

import { NavBar } from "./components/NavBar";
import LoginForm from "./login/page";

export default function Home() {
  const { currentUser, loggedIn } = useAuth();

  useEffect(() => {
    console.log("Auth state updated in home: ", loggedIn, currentUser);
  }, [currentUser, loggedIn]);

  return (
    <div>
      <NavBar />
      {loggedIn ? <p>User logged in</p> : <LoginForm />}
    </div>
  );
}
