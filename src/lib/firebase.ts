import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  doc,
  getFirestore,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const getUIErrorFromFirebaseError = (firebaseErrorCode: string) => {
  if (!firebaseErrorCode) return "";
  switch (firebaseErrorCode) {
    case "auth/email-already-in-use":
      return "This email address is already in use!";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Wrong email or password.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 8 characters long.";

    case "ui/empty-email":
      return "Please enter your email.";
    case "ui/empty-password":
      return "Please enter your password.";

    default:
      return "An error occured";
  }
};

export interface FirebaseError {
  code: string;
  message: string;
}

export async function createUser(
  email: string,
  uid: string,
  theme: "light" | "dark" | "system"
) {
  await setDoc(
    doc(db, "users", uid),
    {
      email,
      uid,
      theme,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUserDoc(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserTheme(
  uid: string,
  theme: "light" | "dark" | "system"
) {
  await setDoc(
    doc(db, "users", uid),
    { theme, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
