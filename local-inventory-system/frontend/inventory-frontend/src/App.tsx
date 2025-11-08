import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Auth/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProductsPage from './pages/Products/ProductsPage';
import CategoriesPage from './pages/Categories/CategoriesPage';
import SuppliersPage from './pages/Suppliers/SuppliersPage';
import StockMovementsPage from './pages/StockMovements/StockMovementsPage';
import UsersPage from './pages/Users/UsersPage';
import CompanySettingsPage from './pages/CompanySettings/CompanySettingsPage';
import ReportsPage from './pages/Reports/ReportsPage';
import CustomersPage from './pages/Customers/CustomersPage';
import SalesPage from './pages/Sales/SalesPage';
import FinancialReportsPage from './pages/FinancialReports/FinancialReportsPage';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }
  
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Layout><DashboardPage /></Layout>
        </PrivateRoute>
      } />
      
      <Route path="/products" element={
        <PrivateRoute>
          <Layout><ProductsPage /></Layout>
        </PrivateRoute>
      } />
      
      <Route path="/categories" element={
        <PrivateRoute>
          <Layout><CategoriesPage /></Layout>
        </PrivateRoute>
      } />
      
      <Route path="/suppliers" element={
        <PrivateRoute>
          <Layout><SuppliersPage /></Layout>
        </PrivateRoute>
      } />
      
      <Route path="/stock-movements" element={
        <PrivateRoute>
          <Layout><StockMovementsPage /></Layout>
        </PrivateRoute>
      } />
      
      <Route path="/reports" element={
        <PrivateRoute>
          <Layout><ReportsPage /></Layout>
        </PrivateRoute>
      } />
      
      <Route path="/customers" element={
        <PrivateRoute>
          <Layout><CustomersPage /></Layout>
        </PrivateRoute>
      } />
      
      <Route path="/sales" element={
        <PrivateRoute>
          <Layout><SalesPage /></Layout>
        </PrivateRoute>
      } />
      
      <Route path="/financial-reports" element={
        <PrivateRoute>
          <Layout><FinancialReportsPage /></Layout>
        </PrivateRoute>
      } />
      
      <Route path="/users" element={
        <AdminRoute>
          <Layout><UsersPage /></Layout>
        </AdminRoute>
      } />
      
      <Route path="/settings" element={
        <AdminRoute>
          <Layout><CompanySettingsPage /></Layout>
        </AdminRoute>
      } />
      
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
