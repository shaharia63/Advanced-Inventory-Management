import React, { useState, useEffect } from 'react';
import { salesAPI, customersAPI, productsAPI } from '../../services/api';
import { Sale, Customer, Product, SaleItem } from '../../types';

const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    invoice_number: '',
    customer_id: '',
    sale_date: new Date().toISOString().split('T')[0],
    payment_status: 'pending' as 'pending' | 'paid' | 'partial' | 'overdue',
    payment_method: '',
    notes: ''
  });

  const [saleItems, setSaleItems] = useState<Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
    discount_percentage: number;
  }>>([{ product_id: '', quantity: 1, unit_price: 0, discount_percentage: 0 }]);

  useEffect(() => {
    fetchSales();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await salesAPI.getAll({ limit: 100 });
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
      alert('Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductChange = (index: number, field: string, value: any) => {
    const newItems = [...saleItems];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'product_id') {
      const product = products.find(p => p.id === parseInt(value));
      if (product) {
        newItems[index].unit_price = product.selling_price;
      }
    }

    setSaleItems(newItems);
  };

  const addSaleItem = () => {
    setSaleItems([...saleItems, { product_id: '', quantity: 1, unit_price: 0, discount_percentage: 0 }]);
  };

  const removeSaleItem = (index: number) => {
    if (saleItems.length > 1) {
      setSaleItems(saleItems.filter((_, i) => i !== index));
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;

    saleItems.forEach(item => {
      const lineTotal = item.quantity * item.unit_price;
      const discountAmount = lineTotal * (item.discount_percentage / 100);
      subtotal += lineTotal;
      totalDiscount += discountAmount;
    });

    const taxRate = 10; // 10% tax rate - could be from company settings
    const taxableAmount = subtotal - totalDiscount;
    const taxAmount = taxableAmount * (taxRate / 100);
    const total = taxableAmount + taxAmount;

    return {
      subtotal,
      discount_amount: totalDiscount,
      tax_amount: taxAmount,
      total_amount: total
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate invoice number
    if (!formData.invoice_number.trim()) {
      alert('Please enter an invoice number');
      return;
    }

    // Validate sale items
    const validItems = saleItems.filter(item => item.product_id && item.quantity > 0);
    if (validItems.length === 0) {
      alert('Please add at least one product');
      return;
    }

    // Calculate totals
    const totals = calculateTotals();

    // Prepare sale data
    const saleData = {
      ...formData,
      customer_id: formData.customer_id || null,
      payment_method: formData.payment_method || null,
      ...totals,
      items: validItems.map(item => ({
        product_id: parseInt(item.product_id),
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_percentage: item.discount_percentage,
        discount_amount: (item.quantity * item.unit_price * item.discount_percentage) / 100,
        line_total: (item.quantity * item.unit_price) - ((item.quantity * item.unit_price * item.discount_percentage) / 100)
      }))
    };

    try {
      await salesAPI.create(saleData);
      alert('Sale created successfully');
      resetForm();
      fetchSales();
    } catch (error: any) {
      console.error('Error creating sale:', error);
      alert(error.response?.data?.error || 'Failed to create sale');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this sale? Stock will be restored.')) return;

    try {
      await salesAPI.delete(id);
      alert('Sale deleted successfully');
      fetchSales();
    } catch (error: any) {
      console.error('Error deleting sale:', error);
      alert(error.response?.data?.error || 'Failed to delete sale');
    }
  };

  const resetForm = () => {
    setFormData({
      invoice_number: '',
      customer_id: '',
      sale_date: new Date().toISOString().split('T')[0],
      payment_status: 'pending',
      payment_method: '',
      notes: ''
    });
    setSaleItems([{ product_id: '', quantity: 1, unit_price: 0, discount_percentage: 0 }]);
    setShowForm(false);
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sale.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || sale.payment_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading sales...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Sales</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Record Sale'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Record New Sale</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number * (from your invoice software)
                </label>
                <input
                  type="text"
                  required
                  value={formData.invoice_number}
                  onChange={e => setFormData({ ...formData, invoice_number: e.target.value })}
                  placeholder="INV-2024-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <select
                  value={formData.customer_id}
                  onChange={e => setFormData({ ...formData, customer_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Walk-in Customer --</option>
                  {customers.filter(c => c.is_active).map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.customer_type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Date</label>
                <input
                  type="date"
                  value={formData.sale_date}
                  onChange={e => setFormData({ ...formData, sale_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  value={formData.payment_status}
                  onChange={e => setFormData({ ...formData, payment_status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={formData.payment_method}
                  onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select --</option>
                  <option value="cash">Cash</option>
                  <option value="credit">Credit Card</option>
                  <option value="debit">Debit Card</option>
                  <option value="transfer">Bank Transfer</option>
                  <option value="check">Check</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Sale Items</h3>
                <button
                  type="button"
                  onClick={addSaleItem}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 text-sm"
                >
                  + Add Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-500">Qty</th>
                      <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Price</th>
                      <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Discount</th>
                      <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saleItems.map((item, index) => {
                      const product = products.find(p => p.id === parseInt(item.product_id));
                      const lineTotal = item.quantity * item.unit_price;
                      const discount = lineTotal * (item.discount_percentage / 100);
                      const finalTotal = lineTotal - discount;

                      return (
                        <tr key={index} className="border-b">
                          <td className="px-2 py-2">
                            <select
                              value={item.product_id}
                              onChange={e => handleProductChange(index, 'product_id', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              required
                            >
                              <option value="">-- Select Product --</option>
                              {products.map(product => (
                                <option key={product.id} value={product.id}>
                                  {product.name} (Stock: {product.stock_quantity})
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              min="1"
                              max={product?.stock_quantity || 999999}
                              value={item.quantity}
                              onChange={e => handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                              required
                            />
                          </td>
                          <td className="px-2 py-2 text-right">
                            <input
                              type="number"
                              step="0.01"
                              value={item.unit_price}
                              onChange={e => handleProductChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                              className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                              required
                            />
                          </td>
                          <td className="px-2 py-2 text-right">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={item.discount_percentage}
                              onChange={e => handleProductChange(index, 'discount_percentage', parseFloat(e.target.value) || 0)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                            />
                            <span className="text-xs text-gray-500">%</span>
                          </td>
                          <td className="px-2 py-2 text-right font-medium">${finalTotal.toFixed(2)}</td>
                          <td className="px-2 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeSaleItem(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                              disabled={saleItems.length === 1}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Subtotal:</div>
                    <div className="font-semibold text-lg">${totals.subtotal.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Discount:</div>
                    <div className="font-semibold text-lg text-red-600">-${totals.discount_amount.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Tax (10%):</div>
                    <div className="font-semibold text-lg">${totals.tax_amount.toFixed(2)}</div>
                  </div>
                  <div className="border-l-2 border-gray-300 pl-4">
                    <div className="text-gray-600">Total Amount:</div>
                    <div className="font-bold text-2xl text-blue-600">${totals.total_amount.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Record Sale
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by invoice number or customer..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSales.map(sale => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{sale.invoice_number}</div>
                    <div className="text-sm text-gray-500">{sale.salesperson_name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">{sale.customer_name || 'Walk-in'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">
                      {new Date(sale.sale_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    ${sale.total_amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      sale.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                      sale.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      sale.payment_status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {sale.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSales.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No sales found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
