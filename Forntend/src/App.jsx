import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { useAuth } from "./hooks/useAuth.js";

import Navbar from "./components/Navbar.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import StoresList from "./pages/StoresList.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.jsx";
import AdminAddUser from "./pages/AdminAddUser.jsx";
import AdminAddStore from "./pages/AdminAddStore.jsx";
import AdminEditStore from "./pages/AdminEditStore.jsx";
import AdminListStores from "./pages/AdminListStores.jsx";
import StoreDetail from "./pages/StoreDetail.jsx";

// Only allow admins into nested routes
const AdminLayout = () => {
  const { user } = useAuth();
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

// Allow protected roles
const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 font-sans">
          <Navbar />
          <main className="pt-4">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<StoresList />} />

              {/* Store detail page */}
              <Route path="/stores/:id" element={<StoreDetail />} />

              {/* Owner routes */}
              <Route
                path="/owner"
                element={
                  <ProtectedRoute roles={["owner"]}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/add-user" element={<AdminAddUser />} />
                <Route path="/admin/add-store" element={<AdminAddStore />} />
                <Route path="/admin/stores" element={<AdminListStores />} />
                <Route path="/admin/stores/:id/edit" element={<AdminEditStore />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
