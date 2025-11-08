import React, { useEffect, useState } from 'react';
import { reportsAPI, productsAPI } from '../../services/api';
import { Product } from '../../types';
import { FiDownload } from 'react-icons/fi';

const ReportsPage: React.FC = () => {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [inventoryValue, setInventoryValue] = useState<any>(null);

  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
    try {
      const [lowStockRes, valueRes] = await Promise.all([
        productsAPI.getLowStock(),
        reportsAPI.getInventoryValueReport()
      ]);
      setLowStockProducts(lowStockRes.data.products);
      setInventoryValue(valueRes.data);
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  };

  const exportToCSV = () => {
    if (!inventoryValue) return;
    const csv = [
      ['SKU', 'Name', 'Stock', 'Cost Price', 'Selling Price', 'Cost Value', 'Selling Value'],
      ...inventoryValue.products.map((p: any) => [
        p.sku, p.name, p.stock_quantity, p.cost_price, p.selling_price,
        p.cost_value.toFixed(2), p.selling_value.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <FiDownload /> Export CSV
        </button>
      </div>

      {inventoryValue && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-gray-600 text-sm mb-2">Total Items</p>
            <p className="text-3xl font-bold text-gray-900">{inventoryValue.totals.total_items}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-gray-600 text-sm mb-2">Total Cost Value</p>
            <p className="text-3xl font-bold text-green-600">${inventoryValue.totals.total_cost_value.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-gray-600 text-sm mb-2">Total Selling Value</p>
            <p className="text-3xl font-bold text-blue-600">${inventoryValue.totals.total_selling_value.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Low Stock Alerts ({lowStockProducts.length})</h2>
        {lowStockProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">SKU</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Current Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Min Level</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {lowStockProducts.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{p.sku}</td>
                    <td className="px-4 py-3 text-sm">{p.name}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                        {p.stock_quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{p.min_stock_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No low stock items</p>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
