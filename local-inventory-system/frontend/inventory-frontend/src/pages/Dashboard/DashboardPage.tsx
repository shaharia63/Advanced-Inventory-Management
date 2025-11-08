import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reportsAPI } from '../../services/api';
import { DashboardStats } from '../../types';
import { FiPackage, FiAlertTriangle, FiDollarSign, FiTrendingUp, FiGrid, FiTruck } from 'react-icons/fi';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await reportsAPI.getDashboardStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    {
      label: 'Total Products',
      value: stats.total_products,
      icon: FiPackage,
      color: 'bg-blue-500',
      link: '/products',
    },
    {
      label: 'Low Stock Items',
      value: stats.low_stock_products,
      icon: FiAlertTriangle,
      color: 'bg-red-500',
      link: '/products?lowStock=true',
    },
    {
      label: 'Stock Value',
      value: `$${stats.total_stock_value.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'bg-green-500',
      link: '/reports',
    },
    {
      label: 'Recent Movements',
      value: stats.recent_movements,
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      link: '/stock-movements',
    },
    {
      label: 'Categories',
      value: stats.total_categories,
      icon: FiGrid,
      color: 'bg-yellow-500',
      link: '/categories',
    },
    {
      label: 'Suppliers',
      value: stats.total_suppliers,
      icon: FiTruck,
      color: 'bg-indigo-500',
      link: '/suppliers',
    },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2 sm:mt-0">{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={index}
              to={card.link}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">{card.label}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{card.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/products?action=create"
              className="block w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              Add New Product
            </Link>
            <Link
              to="/stock-movements?action=create"
              className="block w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
            >
              Record Stock Movement
            </Link>
            <Link
              to="/products?lowStock=true"
              className="block w-full text-left px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              View Low Stock Alerts
            </Link>
            <Link
              to="/reports"
              className="block w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium"
            >
              View Reports
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">System Status</span>
              <span className="font-semibold text-green-600">Online</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Database</span>
              <span className="font-semibold text-gray-900">SQLite Local</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Last Backup</span>
              <span className="font-semibold text-gray-900">N/A</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Version</span>
              <span className="font-semibold text-gray-900">1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
