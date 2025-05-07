// src/context/AuthContext.js
import { createContext, useContext } from "react";

export const AuthContext = createContext(null); // non‑component export :contentReference[oaicite:5]{index=5}

export function useAuth() {
  return useContext(AuthContext); // custom hook, also non‑component :contentReference[oaicite:6]{index=6}
}
