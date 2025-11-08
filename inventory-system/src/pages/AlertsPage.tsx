import React, { useEffect, useState } from 'react';
import { supabase, Product, Category } from '../lib/supabase';
import { AlertTriangle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AlertsPage() {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').eq('is_active', true),
        supabase.from('categories').select('*'),
      ]);

      if (productsRes.data) {
        const outOfStock = productsRes.data.filter(p => p.current_stock === 0);
        const lowStock = productsRes.data.filter(
          p => p.current_stock > 0 && p.current_stock <= p.min_stock
        );
        setOutOfStockProducts(outOfStock);
        setLowStockProducts(lowStock);
      }

      if (categoriesRes.data) setCategories(categoriesRes.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  const renderProductTable = (products: Product[], title: string, emptyMessage: string) => (
    <div className="bg-white rounded-lg shadow mb-8">
      <div className="p-6 border-b border-gray-200 flex items-center">
        <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <span className="ml-auto bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          {products.length} items
        </span>
      </div>

      {products.length === 0 ? (
        <div className="p-6 text-center text-gray-500">{emptyMessage}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reorder Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => {
                const category = categories.find(c => c.id === product.category_id);
                const reorderQty = Math.max(product.min_stock * 2 - product.current_stock, 0);
                
                return (
                  <tr key={product.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{category?.name || '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-red-600">
                      {product.current_stock}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.min_stock}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.warehouse_location || '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-indigo-600">{reorderQty}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Low Stock Alerts</h1>
        <p className="text-gray-600">Monitor products that need restocking</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-red-600 mr-4" />
            <div>
              <h3 className="text-lg font-bold text-red-900">Out of Stock</h3>
              <p className="text-3xl font-bold text-red-600 mt-1">{outOfStockProducts.length}</p>
              <p className="text-sm text-red-700 mt-1">Products completely out of stock</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600 mr-4" />
            <div>
              <h3 className="text-lg font-bold text-yellow-900">Low Stock</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{lowStockProducts.length}</p>
              <p className="text-sm text-yellow-700 mt-1">Products below minimum stock level</p>
            </div>
          </div>
        </div>
      </div>

      {/* Out of Stock Table */}
      {renderProductTable(
        outOfStockProducts,
        'Out of Stock Products',
        'No products are out of stock.'
      )}

      {/* Low Stock Table */}
      {renderProductTable(
        lowStockProducts,
        'Low Stock Products',
        'No products are running low on stock.'
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> The "Reorder Qty" suggests ordering enough to bring stock to 2x the minimum level. 
          You can record incoming stock from the{' '}
          <Link to="/stock-movements" className="underline font-medium">Stock Movements</Link> page.
        </p>
      </div>
    </div>
  );
}
