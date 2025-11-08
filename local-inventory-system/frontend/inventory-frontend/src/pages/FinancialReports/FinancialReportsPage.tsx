import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api';

interface ReportData {
  salesReport: any[];
  topProducts: any[];
  customerAnalytics: any[];
  profitAnalysis: any;
  paymentMethods: any[];
  salesperformance: any[];
  outstandingPayments: any;
}

const FinancialReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });
  const [activeTab, setActiveTab] = useState<'sales' | 'profit' | 'customers' | 'payments'>('sales');

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [
        salesReport,
        topProducts,
        customerAnalytics,
        profitAnalysis,
        paymentMethods,
        salespersonPerformance,
        outstandingPayments
      ] = await Promise.all([
        reportsAPI.getSalesReport({ ...dateRange, group_by: 'day' }),
        reportsAPI.getTopSellingProducts({ ...dateRange, limit: 10 }),
        reportsAPI.getCustomerAnalytics({ ...dateRange, limit: 10 }),
        reportsAPI.getProfitAnalysis(dateRange),
        reportsAPI.getPaymentMethodAnalysis(dateRange),
        reportsAPI.getSalespersonPerformance(dateRange),
        reportsAPI.getOutstandingPayments()
      ]);

      setReportData({
        salesReport: salesReport.data.data || [],
        topProducts: topProducts.data.data || [],
        customerAnalytics: customerAnalytics.data.data || [],
        profitAnalysis: profitAnalysis.data || { data: [], totals: {} },
        paymentMethods: paymentMethods.data.data || [],
        salesperformance: salespersonPerformance.data.data || [],
        outstandingPayments: outstandingPayments.data || { data: [], totals: {} }
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading financial reports...</div>
      </div>
    );
  }

  if (!reportData) {
    return <div className="p-6">No data available</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Financial Reports</h1>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.start_date}
                onChange={e => setDateRange({ ...dateRange, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.end_date}
                onChange={e => setDateRange({ ...dateRange, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={fetchReports}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Reports
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'sales' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Sales Analysis
          </button>
          <button
            onClick={() => setActiveTab('profit')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'profit' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Profit Analysis
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'customers' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Customer Analytics
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'payments' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Payments
          </button>
        </div>
      </div>

      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportData.salesReport.length > 0 && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Sales</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData.salesReport.reduce((sum, r) => sum + (r.total_sales || 0), 0)}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
                  <p className="text-2xl font-bold text-green-600">
                    ${reportData.salesReport.reduce((sum, r) => sum + (parseFloat(r.revenue) || 0), 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Average Sale</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    ${(reportData.salesReport.reduce((sum, r) => sum + (parseFloat(r.revenue) || 0), 0) /
                      reportData.salesReport.reduce((sum, r) => sum + (r.total_sales || 0), 0) || 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Tax</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    ${reportData.salesReport.reduce((sum, r) => sum + (parseFloat(r.tax) || 0), 0).toFixed(2)}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Qty Sold</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.topProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.sku}</div>
                      </td>
                      <td className="px-4 py-3 text-center font-medium">{product.total_quantity}</td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">
                        ${parseFloat(product.total_revenue).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        ${parseFloat(product.avg_price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {reportData.topProducts.length === 0 && (
                <div className="text-center py-8 text-gray-500">No sales data in this period</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Salesperson Performance</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salesperson</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Sales</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Sale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.salesperformance.map((person, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{person.name}</div>
                        <div className="text-sm text-gray-500">{person.email}</div>
                      </td>
                      <td className="px-4 py-3 text-center font-medium">{person.total_sales || 0}</td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">
                        ${parseFloat(person.total_revenue || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        ${parseFloat(person.avg_sale || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profit' && (
        <div className="space-y-6">
          {reportData.profitAnalysis.totals && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Cost</h3>
                <p className="text-2xl font-bold text-gray-900">
                  ${reportData.profitAnalysis.totals.total_cost?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
                <p className="text-2xl font-bold text-blue-600">
                  ${reportData.profitAnalysis.totals.total_revenue?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Profit</h3>
                <p className="text-2xl font-bold text-green-600">
                  ${reportData.profitAnalysis.totals.total_profit?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Profit Margin</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {reportData.profitAnalysis.totals.overall_margin || '0.00'}%
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Product Profit Analysis</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Sold</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Profit</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(reportData.profitAnalysis.data || []).map((product: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.sku}</div>
                      </td>
                      <td className="px-4 py-3 text-center font-medium">{product.total_sold}</td>
                      <td className="px-4 py-3 text-right">${parseFloat(product.total_cost).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-medium text-blue-600">
                        ${parseFloat(product.total_revenue).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">
                        ${parseFloat(product.profit).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${
                          parseFloat(product.profit_margin) >= 30 ? 'text-green-600' :
                          parseFloat(product.profit_margin) >= 20 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {parseFloat(product.profit_margin).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!reportData.profitAnalysis.data || reportData.profitAnalysis.data.length === 0) && (
                <div className="text-center py-8 text-gray-500">No sales data in this period</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Top Customers</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Purchases</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Purchase</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Purchase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.customerAnalytics.map((customer, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{customer.name}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        customer.customer_type === 'wholesale' ? 'bg-blue-100 text-blue-800' :
                        customer.customer_type === 'distributor' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.customer_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-medium">{customer.total_purchases || 0}</td>
                    <td className="px-4 py-3 text-right font-medium text-green-600">
                      ${parseFloat(customer.total_spent || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      ${parseFloat(customer.avg_purchase || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      {customer.last_purchase_date ? new Date(customer.last_purchase_date).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reportData.customerAnalytics.length === 0 && (
              <div className="text-center py-8 text-gray-500">No customer data in this period</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportData.paymentMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1 capitalize">{method.payment_method}</h3>
                <p className="text-2xl font-bold text-gray-900">${parseFloat(method.total_amount).toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">{method.transaction_count} transactions</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Outstanding Payments</h2>
            {reportData.outstandingPayments.totals && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-red-700 mb-1">Total Outstanding</h3>
                  <p className="text-2xl font-bold text-red-600">
                    ${reportData.outstandingPayments.totals.total_outstanding?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-orange-700 mb-1">Pending Invoices</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {reportData.outstandingPayments.totals.total_invoices || 0}
                  </p>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Paid</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Outstanding</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(reportData.outstandingPayments.data || []).map((payment: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{payment.invoice_number}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{payment.customer_name}</div>
                        <div className="text-xs text-gray-500">{payment.customer_phone}</div>
                      </td>
                      <td className="px-4 py-3">{new Date(payment.sale_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">${parseFloat(payment.total_amount).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-green-600">
                        ${parseFloat(payment.paid_amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-red-600">
                        ${parseFloat(payment.outstanding_amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          payment.days_outstanding > 30 ? 'bg-red-100 text-red-800' :
                          payment.days_outstanding > 14 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {Math.floor(payment.days_outstanding)} days
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!reportData.outstandingPayments.data || reportData.outstandingPayments.data.length === 0) && (
                <div className="text-center py-8 text-gray-500">No outstanding payments</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialReportsPage;
