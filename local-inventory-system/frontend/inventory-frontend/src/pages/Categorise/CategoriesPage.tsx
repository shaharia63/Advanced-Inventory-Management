import React, { useEffect, useState } from 'react';
import { categoriesAPI } from '../../services/api';
import { Category } from '../../types';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const CategoriesPage: React.FC = () => {
  const { isAdminOrManager } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    const res = await categoriesAPI.getAll();
    setCategories(res.data.categories);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await categoriesAPI.update(editing.id, formData);
      } else {
        await categoriesAPI.create(formData);
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', description: '' });
      loadCategories();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save category');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this category?')) return;
    await categoriesAPI.delete(id);
    loadCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        {isAdminOrManager && (
          <button onClick={() => { setFormData({ name: '', description: '' }); setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FiPlus /> Add Category
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="font-semibold text-lg mb-2">{cat.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{cat.description}</p>
            {isAdminOrManager && (
              <div className="flex gap-2">
                <button onClick={() => { setEditing(cat); setFormData({ name: cat.name, description: cat.description || '' }); setShowForm(true); }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                  <FiEdit2 size={16} /> Edit
                </button>
                <button onClick={() => handleDelete(cat.id)}
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
              <h2 className="text-xl font-semibold">{editing ? 'Edit' : 'Add'} Category</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
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

export default CategoriesPage;
