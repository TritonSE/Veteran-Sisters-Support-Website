import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin with service account
const app = initializeApp({
  credential: cert(JSON.parse(process.env.BACKEND_FIREBASE_SERVICE_ACCOUNT)),
});

export const auth = getAuth(app);
