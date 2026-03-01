import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/layout/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Orders from '../pages/admin/Orders';
import ServicePacks from '../pages/admin/ServicePacks';
import CrmLeads from '../pages/admin/CrmLeads';
import CrmLeadDetail from '../pages/admin/CrmLeadDetail';
import CrmPipeline from '../pages/admin/CrmPipeline';
import Login from '../pages/admin/Login';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Routes>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="orders" element={<Orders />} />
                <Route path="service-packs" element={<ServicePacks />} />
                <Route path="crm/leads" element={<CrmLeads />} />
                <Route path="crm/leads/:id" element={<CrmLeadDetail />} />
                <Route path="crm/pipeline" element={<CrmPipeline />} />
              </Routes>
            </AdminLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
