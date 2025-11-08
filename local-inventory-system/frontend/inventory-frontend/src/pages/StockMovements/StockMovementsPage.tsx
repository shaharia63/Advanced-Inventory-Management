import React, { useEffect, useState } from 'react';
import { stockMovementsAPI, productsAPI } from '../../services/api';
import { StockMovement, Product } from '../../types';
import { FiPlus } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const StockMovementsPage: React.FC = () => {
  const { isAdminOrManager } = useAuth();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_id: 0,
    movement_type: 'incoming',
    quantity: 0,
    reference: '',
    notes: ''
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [movRes, prodRes] = await Promise.all([
      stockMovementsAPI.getAll({ limit: 100 }),
      productsAPI.getAll()
    ]);
    setMovements(movRes.data.movements);
    setProducts(prodRes.data.products);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await stockMovementsAPI.create(formData);
      setShowForm(false);
      setFormData({ product_id: 0, movement_type: 'incoming', quantity: 0, reference: '', notes: '' });
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create movement');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Stock Movements</h1>
        {isAdminOrManager && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FiPlus /> Add Movement
          </button>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {movements.map(m => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{new Date(m.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-medium">{m.product_name}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      m.movement_type === 'incoming' ? 'bg-green-100 text-green-800' :
                      m.movement_type === 'outgoing' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>{m.movement_type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">{m.quantity}</td>
                  <td className="px-4 py-3 text-sm">{m.reference || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="bg-blue-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-xl font-semibold">Record Stock Movement</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product *</label>
                <select required value={formData.product_id} onChange={e => setFormData({ ...formData, product_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Movement Type *</label>
                <select required value={formData.movement_type} onChange={e => setFormData({ ...formData, movement_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="incoming">Incoming</option>
                  <option value="outgoing">Outgoing</option>
                  <option value="adjustment">Adjustment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quantity *</label>
                <input type="number" required value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Reference</label>
                <input type="text" value={formData.reference} onChange={e => setFormData({ ...formData, reference: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea rows={2} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 border text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockMovementsPage;
