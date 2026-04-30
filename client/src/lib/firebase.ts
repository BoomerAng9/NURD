/**
 * Firebase Web SDK — bound to the FOAI-AIMS project.
 *
 * Per `reference_nurdscode_in_foai_aims_firebase_project.md`: NurdsCode is a
 * vertical inside the existing `foai-aims` Firebase + GCP project (alongside
 * Per|Form, CTI Hub, Coastal Brewing, A.I.M.S. SaaS). Auth users + Firestore
 * data are FOAI-ecosystem-wide identity; vertical-specific data is scoped via
 * `vertical: "nurdscode"` collection prefixes.
 *
 * Per `docs/architecture/NURDSCODE-vNext-Architecture.md`: Auth = Firebase
 * Auth first; Better Auth later if self-host needed.
 *
 * Env vars come from `.env.local` (gitignored), copied from the openclaw-sop5
 * secret store on myclaw-vps.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Idempotent init — guard against HMR / multi-import re-init.
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

// OAuth providers — configured at the foai-aims project level in the Firebase
// Console. The provider objects below just request the standard OAuth scopes.
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const githubProvider = new GithubAuthProvider();
githubProvider.addScope("read:user");
githubProvider.addScope("user:email");

/**
 * Helper: returns true if Firebase is configured for this build.
 * Allows graceful degradation in dev when env vars haven't been set up yet.
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}
