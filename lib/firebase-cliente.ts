
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getApps } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBK3Y9x5PkRSILFK3C0ikuI-Lco6aObm0w",
  authDomain: "lumina-20c15.firebaseapp.com",
  projectId: "lumina-20c15",
  appId: "1:371110077305:web:f6475c815bc36f5263c5a8",
};

export const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
export const auth = getAuth(app);