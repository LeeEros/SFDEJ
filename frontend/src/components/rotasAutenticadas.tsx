// ProtectedRoute.tsx
import { JSX } from "react";
import { Navigate } from "react-router-dom";

export default function  AutenticarRota({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
