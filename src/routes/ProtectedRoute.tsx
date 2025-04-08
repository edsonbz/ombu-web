import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { Spinner } from "@/pages/Spinner/Spinner";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const { token, loading } = useAuth();

  if (loading) return <Spinner/>; 

  return token ? <>{children}</> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
