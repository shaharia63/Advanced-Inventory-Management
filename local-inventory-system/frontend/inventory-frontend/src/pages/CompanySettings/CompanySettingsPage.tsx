import React, { useEffect, useState } from 'react';
import { companyAPI } from '../../services/api';
import { CompanySettings } from '../../types';
import { FiUpload, FiTrash2 } from 'react-icons/fi';

const CompanySettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [formData, setFormData] = useState({ company_name: '', address: '', phone: '', email: '' });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    const res = await companyAPI.getSettings();
    setSettings(res.data.settings);
    setFormData({
      company_name: res.data.settings.company_name || '',
      address: res.data.settings.address || '',
      phone: res.data.settings.phone || '',
      email: res.data.settings.email || ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await companyAPI.updateSettings(formData);
      alert('Settings updated successfully');
      loadSettings();
    } catch (error) {
      alert('Failed to update settings');
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    const formData = new FormData();
    formData.append('logo', logoFile);
    try {
      await companyAPI.uploadLogo(formData);
      alert('Logo uploaded successfully');
      setLogoFile(null);
      loadSettings();
    } catch (error) {
      alert('Failed to upload logo');
    }
  };

  const handleDeleteLogo = async () => {
    if (!window.confirm('Delete company logo?')) return;
    try {
      await companyAPI.deleteLogo();
      alert('Logo deleted successfully');
      loadSettings();
    } catch (error) {
      alert('Failed to delete logo');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Company Settings</h1>
      
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Company Logo</h2>
        {settings?.logo_path && (
          <div className="mb-4">
            <img 
              src={`http://localhost:3000${settings.logo_path}`} 
              alt="Company Logo" 
              className="h-24 object-contain border rounded-lg p-2"
            />
            <button onClick={handleDeleteLogo}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
              <FiTrash2 /> Delete Logo
            </button>
          </div>
        )}
        <div className="flex gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <button onClick={handleLogoUpload} disabled={!logoFile}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            <FiUpload /> Upload
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Company Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Company Name</label>
            <input type="text" value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <textarea rows={3} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanySettingsPage;
