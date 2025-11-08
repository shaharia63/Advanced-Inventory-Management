import React, { useEffect, useState } from 'react';
import { suppliersAPI } from '../../services/api';
import { Supplier } from '../../types';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const SuppliersPage: React.FC = () => {
  const { isAdminOrManager } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({ name: '', contact_person: '', phone: '', email: '', address: '' });

  useEffect(() => { loadSuppliers(); }, []);

  const loadSuppliers = async () => {
    const res = await suppliersAPI.getAll();
    setSuppliers(res.data.suppliers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await suppliersAPI.update(editing.id, formData);
      } else {
        await suppliersAPI.create(formData);
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', contact_person: '', phone: '', email: '', address: '' });
      loadSuppliers();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save supplier');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this supplier?')) return;
    await suppliersAPI.delete(id);
    loadSuppliers();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Suppliers</h1>
        {isAdminOrManager && (
          <button onClick={() => { setFormData({ name: '', contact_person: '', phone: '', email: '', address: '' }); setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FiPlus /> Add Supplier
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map(sup => (
          <div key={sup.id} className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="font-semibold text-lg mb-2">{sup.name}</h3>
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              {sup.contact_person && <p>Contact: {sup.contact_person}</p>}
              {sup.phone && <p>Phone: {sup.phone}</p>}
              {sup.email && <p>Email: {sup.email}</p>}
              {sup.address && <p>Address: {sup.address}</p>}
            </div>
            {isAdminOrManager && (
              <div className="flex gap-2">
                <button onClick={() => { setEditing(sup); setFormData(sup); setShowForm(true); }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                  <FiEdit2 size={16} /> Edit
                </button>
                <button onClick={() => handleDelete(sup.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
                  <FiTrash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="bg-blue-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-xl font-semibold">{editing ? 'Edit' : 'Add'} Supplier</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Person</label>
                <input type="text" value={formData.contact_person || ''} onChange={e => setFormData({ ...formData, contact_person: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input type="text" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <textarea rows={2} value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 border text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersPage;
