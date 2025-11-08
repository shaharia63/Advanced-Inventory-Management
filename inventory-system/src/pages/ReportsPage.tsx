import React, { useEffect, useState } from 'react';
import { supabase, Product, Category, StockMovement } from '../lib/supabase';
import { FileText, Download, TrendingUp, Package, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

export default function ReportsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes, movementsRes] = await Promise.all([
        supabase.from('products').select('*').eq('is_active', true),
        supabase.from('categories').select('*'),
        supabase.from('stock_movements').select('*').order('created_at', { ascending: false }).limit(1000),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (movementsRes.data) setMovements(movementsRes.data);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportInventoryReport = () => {
    const data = products.map(p => {
      const category = categories.find(c => c.id === p.category_id);
      return {
        SKU: p.sku,
        Name: p.name,
        Category: category?.name || '',
        'Current Stock': p.current_stock,
        'Min Stock': p.min_stock,
        'Cost Price': p.cost_price || 0,
        'Selling Price': p.selling_price || 0,
        'Stock Value': (p.current_stock * (p.cost_price || 0)).toFixed(2),
        Manufacturer: p.manufacturer || '',
        Location: p.warehouse_location || '',
      };
    });
    exportToCSV(data, `inventory-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  const exportStockMovements = () => {
    const data = movements.map(m => {
      const product = products.find(p => p.id === m.product_id);
      return {
        Date: format(new Date(m.created_at), 'yyyy-MM-dd HH:mm'),
        Product: product?.name || 'Unknown',
        SKU: product?.sku || '',
        Type: m.movement_type,
        Quantity: m.quantity,
        'Previous Stock': m.previous_stock || 0,
        'New Stock': m.new_stock || 0,
        Reason: m.reason || '',
        Notes: m.notes || '',
      };
    });
    exportToCSV(data, `stock-movements-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  const exportLowStockReport = () => {
    const lowStockData = products
      .filter(p => p.current_stock <= p.min_stock)
      .map(p => {
        const category = categories.find(c => c.id === p.category_id);
        return {
          SKU: p.sku,
          Name: p.name,
          Category: category?.name || '',
          'Current Stock': p.current_stock,
          'Min Stock': p.min_stock,
          Status: p.current_stock === 0 ? 'Out of Stock' : 'Low Stock',
          'Reorder Qty': Math.max(p.min_stock * 2 - p.current_stock, 0),
        };
      });
    exportToCSV(lowStockData, `low-stock-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  const getCategoryStats = () => {
    return categories.map(cat => {
      const catProducts = products.filter(p => p.category_id === cat.id);
      const totalStock = catProducts.reduce((sum, p) => sum + p.current_stock, 0);
      const totalValue = catProducts.reduce((sum, p) => sum + (p.current_stock * (p.cost_price || 0)), 0);
      return {
        category: cat.name,
        productCount: catProducts.length,
        totalStock,
        totalValue,
      };
    });
  };

  const getOverallStats = () => {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.current_stock, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.current_stock * (p.cost_price || 0)), 0);
    const lowStockCount = products.filter(p => p.current_stock <= p.min_stock).length;
    
    return { totalProducts, totalStock, totalValue, lowStockCount };
  };

  if (loading) return <div className="text-center py-8">Loading reports...</div>;

  const stats = getOverallStats();
  const categoryStats = getCategoryStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Inventory insights and data exports</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Stock Units</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStock}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.lowStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Inventory by Category</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categoryStats.map((stat) => (
                <tr key={stat.category}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{stat.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{stat.productCount}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{stat.totalStock}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${stat.totalValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Export Data</h2>
          <p className="text-sm text-gray-600 mt-1">Download reports in CSV format</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={exportInventoryReport}
            className="flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Full Inventory
          </button>
          <button
            onClick={exportLowStockReport}
            className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Low Stock Report
          </button>
          <button
            onClick={exportStockMovements}
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Stock Movements
          </button>
        </div>
      </div>
    </div>
  );
}
