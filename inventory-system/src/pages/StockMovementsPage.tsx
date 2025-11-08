import React, { useEffect, useState } from 'react';
import { supabase, Product, StockMovement } from '../lib/supabase';
import { Plus, X, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

export default function StockMovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    product_id: '',
    movement_type: 'incoming',
    quantity: '',
    reason: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [movementsRes, productsRes] = await Promise.all([
        supabase
          .from('stock_movements')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100),
        supabase.from('products').select('*').order('name'),
      ]);

      if (movementsRes.data) setMovements(movementsRes.data);
      if (productsRes.data) setProducts(productsRes.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const product = products.find(p => p.id === formData.product_id);
      if (!product) throw new Error('Product not found');

      const quantity = parseInt(formData.quantity);
      const previousStock = product.current_stock;
      let newStock = previousStock;

      if (formData.movement_type === 'incoming') {
        newStock = previousStock + quantity;
      } else if (formData.movement_type === 'outgoing') {
        newStock = previousStock - quantity;
        if (newStock < 0) {
          throw new Error('Insufficient stock');
        }
      } else if (formData.movement_type === 'adjustment') {
        newStock = quantity;
      }

      // Insert stock movement
      const { error: movementError } = await supabase.from('stock_movements').insert([{
        product_id: formData.product_id,
        movement_type: formData.movement_type,
        quantity: quantity,
        previous_stock: previousStock,
        new_stock: newStock,
        user_id: user.id,
        reason: formData.reason,
        notes: formData.notes,
      }]);

      if (movementError) throw movementError;

      // Update product stock
      const { error: updateError } = await supabase
        .from('products')
        .update({ current_stock: newStock })
        .eq('id', formData.product_id);

      if (updateError) throw updateError;

      setShowModal(false);
      setFormData({ product_id: '', movement_type: 'incoming', quantity: '', reason: '', notes: '' });
      loadData();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'incoming': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'outgoing': return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'adjustment': return <RefreshCw className="w-5 h-5 text-blue-600" />;
      default: return null;
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Movements</h1>
          <p className="text-gray-600">Track all inventory movements</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Record Movement
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Before</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">After</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {movements.map((movement) => {
              const product = products.find(p => p.id === movement.product_id);
              return (
                <tr key={movement.id}>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {format(new Date(movement.created_at), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getMovementIcon(movement.movement_type)}
                      <span className="text-sm capitalize">{movement.movement_type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {movement.movement_type === 'outgoing' && '-'}
                    {movement.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{movement.previous_stock}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{movement.new_stock}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{movement.reason || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Record Stock Movement</h2>
              <button onClick={() => setShowModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product*</label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Current: {product.current_stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Movement Type*</label>
                <select
                  value={formData.movement_type}
                  onChange={(e) => setFormData({ ...formData, movement_type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="incoming">Incoming (Add Stock)</option>
                  <option value="outgoing">Outgoing (Remove Stock)</option>
                  <option value="adjustment">Adjustment (Set Stock)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity* {formData.movement_type === 'adjustment' && '(New Total)'}
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Purchase order, Sale, Damaged goods"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                  Record Movement
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
