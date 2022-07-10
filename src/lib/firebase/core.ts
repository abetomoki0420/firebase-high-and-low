import { apiKey, authDomain, projectId, storageBucket, appId } from "./config";

import { type FirebaseOptions, initializeApp } from "firebase/app";

const firebaseConfig: FirebaseOptions = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  appId,
};

export const app = initializeApp(firebaseConfig);
