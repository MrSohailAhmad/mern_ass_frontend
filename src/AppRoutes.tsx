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
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          !user ? (
            <Login />
          ) : (
            <Navigate to={user.role === UserRole.ADMIN ? "/admin" : "/user"} />
          )
        }
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/" />}
      />
      <Route path="/doctors" element={<DoctorDirectory />} />

      {/* User Dashboard Routes */}
      {user?.role === UserRole.USER && (
        <Route path="/user" element={<Dashboard />}>
          <Route index element={<MyAppointments />} />
          <Route path="doctors" element={<DoctorDirectory />} />
        </Route>
      )}

      {/* Admin Dashboard Routes */}
      {user?.role === UserRole.ADMIN && (
        <Route path="/admin" element={<Dashboard />}>
          <Route index element={<AdminAppointments />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="doctors-directory" element={<DoctorDirectory />} />
        </Route>
      )}

      {/* Fallbacks */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
