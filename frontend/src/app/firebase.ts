import { FirebaseOptions, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const app = initializeApp(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE ?? "") as FirebaseOptions);

export const storage = getStorage(app);
