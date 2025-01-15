import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const app = initializeApp(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE ?? "") as FirebaseOptions);
export const storage = getStorage(app);

export const auth = getAuth(app);
export default app;
