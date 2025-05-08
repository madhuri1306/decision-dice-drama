
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface AuthLayoutProps {
  children: React.ReactNode;
  requiredAuth?: boolean;
  redirectTo?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  requiredAuth = false,
  redirectTo = "/",
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading) {
      if (requiredAuth && !isAuthenticated) {
        navigate("/login", { replace: true });
      } else if (!requiredAuth && isAuthenticated) {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, requiredAuth, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-scale">
          <p className="text-2xl font-bold text-game-primary">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication check passes, render children
  if ((requiredAuth && isAuthenticated) || (!requiredAuth && !isAuthenticated)) {
    return <>{children}</>;
  }

  // Render nothing while redirecting
  return null;
};

export default AuthLayout;
