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
// import { readFileSync } from "fs";

// import admin from "firebase-admin";

// if (!admin.apps.length) {
//   const raw = readFileSync("/etc/secrets/firebase-service-account.json", "utf8");
//   const serviceAccount = JSON.parse(raw);

//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// export default admin;

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// ❌ do NOT call dotenv.config() on Vercel

const raw = process.env.BACKEND_FIREBASE_SERVICE_ACCOUNT;

if (!raw) {
  throw new Error("BACKEND_FIREBASE_SERVICE_ACCOUNT not set");
}

let app;

if (!getApps().length) {
  const serviceAccount = JSON.parse(raw);

  // Required for Vercel / serverless
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  app = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);

