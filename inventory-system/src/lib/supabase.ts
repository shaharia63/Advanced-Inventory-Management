import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://lnukcsvalpqqgtfgqtfa.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxudWtjc3ZhbHBxcWd0ZmdxdGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzQ3ODAsImV4cCI6MjA3Nzc1MDc4MH0.0HGkqX4ODGM8oltYld9oBR6of-ohIlyqZhPmvm8BCx8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Category = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Supplier = {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category_id: string | null;
  supplier_id: string | null;
  cost_price: number | null;
  selling_price: number | null;
  current_stock: number;
  min_stock: number;
  manufacturer: string | null;
  warehouse_location: string | null;
  weight: number | null;
  dimensions: string | null;
  image_url: string | null;
  barcode: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type StockMovement = {
  id: string;
  product_id: string;
  movement_type: string;
  quantity: number;
  previous_stock: number | null;
  new_stock: number | null;
  user_id: string;
  reason: string | null;
  notes: string | null;
  created_at: string;
};

export type UserProfile = {
  id: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
