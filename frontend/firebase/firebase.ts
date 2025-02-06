import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import env from "@/util/validateEnv";

export const initFirebase = () => {
  if (!env.NEXT_PUBLIC_FIREBASE) {
    throw new Error("Cannot get firebase settings");
  }

  const firebaseConfig = env.NEXT_PUBLIC_FIREBASE;

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  return { app, auth };
};
