import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { UserRole } from "./interface/comon";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorDirectory from "./pages/DoctorDirectory";
import MyAppointments from "./pages/MyAppointments";
import AdminAppointments from "./pages/AdminAppointments";
import AdminDoctors from "./pages/AdminDoctors";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound"; // optional
import Unauthorized from "./pages/Unauthorized"; // optional

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  console.log("user.role ", user?.role);
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          !user ? (
            <Login />
          ) : (
            <Navigate
              to={user.role === UserRole.ADMIN ? "/admin" : "/my-appointments"}
            />
          )
        }
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/" />}
      />
      <Route path="/doctors" element={<DoctorDirectory />} />

      {/* User routes */}
      <Route
        path="/my-appointments"
        element={
          user ? (
            user.role === UserRole.USER ? (
              <MyAppointments />
            ) : (
              <Navigate to="/unauthorized" />
            )
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          user ? (
            user.role === UserRole.ADMIN ? (
              <Dashboard>
                <AdminAppointments />
              </Dashboard>
            ) : (
              <Navigate to="/unauthorized" />
            )
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/doctors"
        element={
          user ? (
            user.role === UserRole.ADMIN ? (
              <Dashboard>
                <AdminDoctors />
              </Dashboard>
            ) : (
              <Navigate to="/unauthorized" />
            )
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* Fallbacks */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
