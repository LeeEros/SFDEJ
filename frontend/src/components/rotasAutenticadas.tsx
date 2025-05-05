// ProtectedRoute.tsx
import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function AutenticarRota({ children }: { children: JSX.Element }) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const token = localStorage.getItem("jwtToken");
  const api = "http://localhost:3333/login/validar-token"

  useEffect(() => {
    const validarToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await fetch(api, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error("Erro ao validar token:", error);
        setIsValid(false);
      }
    };

    validarToken();
  }, [token]);

  if (isValid === null) {
    return <div>Carregando...</div>;
  }

  if (!isValid) {
    return <Navigate to="/login" />;
  }

  return children;
}
