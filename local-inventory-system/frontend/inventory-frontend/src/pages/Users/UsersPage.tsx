import React, { useEffect, useState } from 'react';
import { usersAPI } from '../../services/api';
import { User } from '../../types';
import { FiPlus, FiEdit2, FiTrash2, FiKey } from 'react-icons/fi';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'user', active: true });

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    const res = await usersAPI.getAll();
    setUsers(res.data.users);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await usersAPI.update(editing.id, { ...formData, active: formData.active ? 1 : 0 });
      } else {
        await usersAPI.create({ ...formData, active: formData.active ? 1 : 0 });
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ email: '', password: '', name: '', role: 'user', active: true });
      loadUsers();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save user');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await usersAPI.delete(id);
      loadUsers();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleResetPassword = async (id: number) => {
    const newPassword = prompt('Enter new password (min 6 characters):');
    if (!newPassword || newPassword.length < 6) return;
    try {
      await usersAPI.resetPassword(id, newPassword);
      alert('Password reset successfully');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to reset password');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <button onClick={() => { setFormData({ email: '', password: '', name: '', role: 'user', active: true }); setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <FiPlus /> Add User
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>{user.role}</span>
            </div>
            <div className="flex items-center gap-2 mb-4 text-sm">
              <span className={`px-2 py-1 rounded ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {user.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(user); setFormData({ email: user.email, password: '', name: user.name, role: user.role, active: user.active === 1 }); setShowForm(true); }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm">
                <FiEdit2 size={14} /> Edit
              </button>
              <button onClick={() => handleResetPassword(user.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 text-sm">
                <FiKey size={14} /> Reset
              </button>
              <button onClick={() => handleDelete(user.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-sm">
                <FiTrash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="bg-blue-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-xl font-semibold">{editing ? 'Edit' : 'Add'} User</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              {!editing && (
                <div>
                  <label className="block text-sm font-medium mb-2">Password *</label>
                  <input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Min 6 characters" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role *</label>
                <select required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.active} onChange={e => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4" />
                  <span className="text-sm font-medium">Active</span>
                </label>
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

export default UsersPage;
