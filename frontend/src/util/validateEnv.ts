import { cleanEnv } from "envalid";
import { json } from "envalid/dist/validators";

/**
 * NextJS only allows the frontend to access environment variables if they start with
 * "NEXT_PUBLIC", so we have to manually acccess attributes of process.env here.
 */
export default cleanEnv(
  {
    NEXT_PUBLIC_FIREBASE_SETTINGS: process.env.NEXT_PUBLIC_FIREBASE_SETTINGS,
  },
  {
    NEXT_PUBLIC_FIREBASE_SETTINGS: json(), // Firebase settings for frontend, stored as a JSON string
  },
);
