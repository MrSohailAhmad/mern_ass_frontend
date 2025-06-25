import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  console.log("user", user);
  // if (!user || user.role !== "admin") return <Navigate to="/unauthorized" />;

  return children;
};

export default AdminRoute;
