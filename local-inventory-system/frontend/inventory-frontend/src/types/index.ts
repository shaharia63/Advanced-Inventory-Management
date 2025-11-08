export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  active: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  category_id?: number;
  category_name?: string;
  supplier_id?: number;
  supplier_name?: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  min_stock_level: number;
  location?: string;
  manufacturer?: string;
  is_low_stock?: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  created_at: string;
}

export interface StockMovement {
  id: number;
  product_id: number;
  product_name?: string;
  sku?: string;
  movement_type: 'incoming' | 'outgoing' | 'adjustment' | 'initial';
  quantity: number;
  reference?: string;
  notes?: string;
  user_id?: number;
  user_name?: string;
  created_at: string;
}

export interface CompanySettings {
  id: number;
  company_name?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_path?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: number;
  user_id?: number;
  user_name?: string;
  action: string;
  entity_type: string;
  entity_id?: number;
  details?: string;
  created_at: string;
}

export interface DashboardStats {
  total_products: number;
  low_stock_products: number;
  total_stock_value: number;
  recent_movements: number;
  total_categories: number;
  total_suppliers: number;
  total_customers?: number;
  total_sales?: number;
  total_revenue?: number;
  pending_payments?: number;
}

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  tax_number?: string;
  customer_type: 'retail' | 'wholesale' | 'distributor';
  credit_limit: number;
  payment_terms: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  is_active: number;
}

export interface Sale {
  id: number;
  invoice_number: string;
  customer_id?: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  sale_date: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'partial' | 'overdue';
  payment_method?: string;
  salesperson_id?: number;
  salesperson_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: SaleItem[];
  payments?: Payment[];
}

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  product_name?: string;
  sku?: string;
  barcode?: string;
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  discount_amount: number;
  line_total: number;
  created_at: string;
}

export interface Payment {
  id: number;
  sale_id: number;
  invoice_number?: string;
  customer_name?: string;
  payment_date: string;
  amount: number;
  payment_method: string;
  reference_number?: string;
  notes?: string;
  created_at: string;
}
