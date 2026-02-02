// UNCOMMENT IF USING LOCALLY

// import { initializeApp, cert } from "firebase-admin/app";
// import { getAuth } from "firebase-admin/auth";
// import dotenv from "dotenv";

// dotenv.config();

// // Initialize Firebase Admin with service account
// const app = initializeApp({
//   credential: cert(JSON.parse(process.env.BACKEND_FIREBASE_SERVICE_ACCOUNT)),
// });

// export const auth = getAuth(app);

// UNCOMMENT FOR DEPLOYED VERSION
import { readFileSync } from "fs";

import admin from "firebase-admin";

if (!admin.apps.length) {
  const raw = readFileSync("/etc/secrets/firebase-service-account.json", "utf8");
  const serviceAccount = JSON.parse(raw);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
