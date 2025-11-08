# Enhanced Local Inventory Management System

## Complete Inventory & Sales Tracking Solution with External Invoice Integration

A full-featured local inventory management system with advanced sales tracking, customer management, and financial reporting capabilities. Built with Node.js, Express, SQLite, React, TypeScript, and Tailwind CSS.

---

## Table of Contents

1. [Key Features](#key-features)
2. [New Sales & Customer Features](#new-sales--customer-features)
3. [System Requirements](#system-requirements)
4. [Installation](#installation)
5. [Quick Start Guide](#quick-start-guide)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Usage Guide](#usage-guide)
9. [External Invoice Integration](#external-invoice-integration)
10. [Troubleshooting](#troubleshooting)

---

## Key Features

### Inventory Management (Existing)
- Product catalog with SKU, barcode, pricing
- Category and supplier management
- Stock level tracking with low stock alerts
- Stock movement history with audit trail
- Barcode scanner integration (camera + USB)
- Mobile-optimized interface

### Sales & Customer Management (NEW)
- **Customer Database**: Complete customer profiles with contact info, billing/shipping addresses
- **Customer Categories**: Retail, Wholesale, Distributor types
- **Sales Recording**: Link external invoice numbers from your existing invoice software
- **Multi-item Sales**: Add multiple products per sale with quantities and discounts
- **Payment Tracking**: Track payment status (pending, paid, partial, overdue)
- **Payment Methods**: Cash, Credit Card, Debit Card, Bank Transfer, Check
- **Automatic Stock Updates**: Stock levels automatically adjusted on sale
- **Credit Management**: Track customer credit limits and payment terms

### Financial Reporting & Analytics (NEW)
- **Sales Reports**: Daily, weekly, monthly revenue analysis
- **Top Selling Products**: Best sellers by quantity and revenue
- **Customer Analytics**: Top customers, purchase history, spending patterns
- **Profit Analysis**: Cost vs revenue, profit margins by product
- **Payment Analytics**: Payment method breakdown, transaction counts
- **Salesperson Performance**: Individual sales and revenue tracking
- **Outstanding Payments**: Overdue invoices and pending payments tracking
- **Tax Reporting**: Automatic tax calculations and summaries

### Security & Administration
- Role-based access control (Admin, Manager, User)
- Audit logging for all actions
- Session-based authentication
- Password hashing with bcrypt

---

## New Sales & Customer Features

### Customer Management
- **Complete Profiles**: Name, email, phone, full address (street, city, state, ZIP)
- **Tax Information**: Tax numbers for business customers
- **Customer Types**: Retail, Wholesale, Distributor
- **Credit Limits**: Set maximum credit per customer
- **Payment Terms**: Immediate, NET 30, NET 45, custom terms
- **Notes Field**: Store customer preferences and special instructions
- **Active/Inactive Status**: Deactivate customers without deleting records
- **Search & Filter**: Quick search by name, email, phone; filter by customer type

### Sales Recording
- **External Invoice Number**: Input invoice number from your existing invoice software
- **Customer Selection**: Link sale to customer or record as walk-in
- **Multi-Product Sales**: Add unlimited products per sale
- **Quantity Control**: Check available stock before sale
- **Pricing Flexibility**: Adjust unit prices per product
- **Discount System**: Apply percentage discounts per line item
- **Automatic Calculations**: Subtotal, discount, tax (10%), total
- **Payment Status**: Track pending, paid, partial, overdue
- **Payment Method Recording**: Cash, card, transfer, check
- **Salesperson Tracking**: Auto-link to logged-in user
- **Notes**: Add sale-specific notes
- **Automatic Stock Adjustment**: Stock levels decrease on sale creation
- **Stock Restoration**: Stock restored if sale is deleted

### Financial Dashboard
- **Date Range Selection**: Analyze any time period
- **Real-time Metrics**: Total sales, revenue, average sale, tax collected
- **Visual Analytics**: Color-coded status indicators
- **Export Ready**: All data available for CSV/Excel export (future feature)

---

## System Requirements

### Backend
- Node.js 16.x or higher
- npm 8.x or pnpm 7.x
- SQLite3 (included)
- 50MB disk space minimum
- No external database server required

### Frontend
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Mobile device (optional) for barcode scanning
- Screen resolution: 320px minimum width

---

## Installation

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd local-inventory-system/backend

# Install dependencies
npm install
# OR
pnpm install

# Initialize enhanced database
npm run init-db-enhanced

# Seed sample data (optional but recommended)
npm run seed-enhanced

# Start the server
npm start
```

The backend server will start on `http://localhost:3000`

### Step 2: Frontend Setup

```bash
# Navigate to frontend directory
cd local-inventory-system/frontend/inventory-frontend

# Install dependencies
npm install
# OR
pnpm install

# Build for production
npm run build

# OR for development with hot reload
npm run dev
```

The frontend will be available at `http://localhost:5173` (dev) or served by backend in production

---

## Quick Start Guide

### 1. First Login
- **URL**: `http://localhost:3000` (or your production URL)
- **Email**: `admin@inventory.local`
- **Password**: `password`
- **IMPORTANT**: Change the default password immediately after first login

### 2. Setup Company Settings (Admin only)
- Navigate to **Settings**
- Enter your company name, address, contact info
- Set tax rate (default: 10%)
- Upload company logo (optional)

### 3. Add Your First Customer
- Navigate to **Customers**
- Click **+ Add Customer**
- Fill in customer details:
  - Name (required)
  - Customer Type (Retail/Wholesale/Distributor)
  - Contact information
  - Billing address
  - Payment terms
- Click **Add Customer**

### 4. Record Your First Sale
- Navigate to **Sales**
- Click **+ Record Sale**
- **Enter External Invoice Number** (from your invoice software)
- Select customer (or leave blank for walk-in)
- Add products:
  - Select product from dropdown
  - Enter quantity (stock level shown)
  - Adjust price if needed
  - Apply discount if applicable
  - Click **+ Add Item** for more products
- Review totals (subtotal, discount, tax, total)
- Select payment status and method
- Click **Record Sale**
- Stock levels automatically update

### 5. View Financial Reports
- Navigate to **Financial Reports**
- Select date range
- Explore tabs:
  - **Sales Analysis**: Revenue trends, top products, salesperson performance
  - **Profit Analysis**: Product profitability, margins, cost analysis
  - **Customer Analytics**: Top customers, purchase patterns
  - **Payments**: Payment methods breakdown, outstanding invoices

---

## Database Schema

### Existing Tables
- `users` - User accounts with authentication
- `company_settings` - Company information and preferences
- `categories` - Product categories
- `suppliers` - Supplier information
- `products` - Product catalog
- `stock_movements` - Stock movement history
- `audit_logs` - System audit trail

### New Tables

#### customers
```sql
- id (INTEGER PRIMARY KEY)
- name (TEXT NOT NULL)
- email (TEXT)
- phone (TEXT)
- address, city, state, zip_code (TEXT)
- tax_number (TEXT)
- customer_type (TEXT: retail/wholesale/distributor)
- credit_limit (REAL)
- payment_terms (TEXT)
- notes (TEXT)
- is_active (INTEGER: 0/1)
- created_at, updated_at (DATETIME)
```

#### sales
```sql
- id (INTEGER PRIMARY KEY)
- invoice_number (TEXT UNIQUE NOT NULL)
- customer_id (INTEGER FK -> customers)
- sale_date (DATETIME)
- subtotal, tax_amount, discount_amount, total_amount (REAL)
- payment_status (TEXT: pending/paid/partial/overdue)
- payment_method (TEXT)
- salesperson_id (INTEGER FK -> users)
- notes (TEXT)
- created_at, updated_at (DATETIME)
```

#### sales_items
```sql
- id (INTEGER PRIMARY KEY)
- sale_id (INTEGER FK -> sales)
- product_id (INTEGER FK -> products)
- quantity (INTEGER)
- unit_price (REAL)
- discount_percentage, discount_amount (REAL)
- line_total (REAL)
- created_at (DATETIME)
```

#### payments
```sql
- id (INTEGER PRIMARY KEY)
- sale_id (INTEGER FK -> sales)
- payment_date (DATETIME)
- amount (REAL)
- payment_method (TEXT)
- reference_number (TEXT)
- notes (TEXT)
- created_at (DATETIME)
```

#### sales_returns
```sql
- id (INTEGER PRIMARY KEY)
- original_sale_id (INTEGER FK -> sales)
- return_date (DATETIME)
- return_reason (TEXT)
- refund_amount (REAL)
- status (TEXT)
- notes (TEXT)
- created_at (DATETIME)
```

---

## API Endpoints

### Customers API
```
GET    /api/customers              - Get all customers (with filters)
GET    /api/customers/:id          - Get customer by ID
GET    /api/customers/:id/sales    - Get customer sales history
GET    /api/customers/:id/stats    - Get customer statistics
POST   /api/customers              - Create new customer
PUT    /api/customers/:id          - Update customer
DELETE /api/customers/:id          - Delete customer
```

### Sales API
```
GET    /api/sales                  - Get all sales (with filters)
GET    /api/sales/:id              - Get sale details with items
GET    /api/sales/summary          - Get sales summary
POST   /api/sales                  - Create new sale
PUT    /api/sales/:id/status       - Update sale payment status
DELETE /api/sales/:id              - Delete sale (restores stock)
```

### Payments API
```
GET    /api/payments               - Get all payments
GET    /api/payments/:id           - Get payment by ID
GET    /api/payments/summary       - Get payment summary
POST   /api/payments               - Record new payment
PUT    /api/payments/:id           - Update payment
DELETE /api/payments/:id           - Delete payment
```

### Reports API (NEW)
```
GET    /api/reports/sales-report           - Sales by period
GET    /api/reports/top-selling            - Top selling products
GET    /api/reports/customer-analytics     - Customer analysis
GET    /api/reports/profit-analysis        - Profit by product
GET    /api/reports/payment-methods        - Payment methods breakdown
GET    /api/reports/salesperson-performance- Salesperson metrics
GET    /api/reports/outstanding-payments   - Overdue invoices
```

---

## Usage Guide

### Workflow: Recording a Sale from External Invoice

1. **In Your Invoice Software**:
   - Create invoice as usual
   - Note the invoice number (e.g., INV-2024-001)

2. **In Inventory System**:
   - Navigate to **Sales** → **+ Record Sale**
   - **Step 1**: Enter the external invoice number
   - **Step 2**: Select customer (if not walk-in)
   - **Step 3**: Add products sold:
     - Each product shows current stock level
     - System prevents overselling
     - Apply discounts as needed
   - **Step 4**: Review calculated totals
   - **Step 5**: Set payment status and method
   - **Step 6**: Click **Record Sale**

3. **Result**:
   - Sale recorded with external invoice reference
   - Stock levels automatically updated
   - Financial reports reflect new data
   - Customer purchase history updated

### Daily Operations

#### Morning Routine
1. Login to system
2. Check Dashboard for:
   - Pending payments
   - Low stock alerts
   - Today's sales target
3. Review outstanding customer payments

#### Recording Sales
1. Use **Quick Sale** interface on mobile
2. Scan product barcodes (or select from dropdown)
3. Enter invoice number from your invoice software
4. Select customer
5. Complete transaction

#### End of Day
1. Review **Financial Reports** → Sales Analysis
2. Check today's revenue and transactions
3. Review payment method breakdown
4. Note any pending payments for follow-up

### Customer Management Best Practices

1. **New Customer Setup**:
   - Complete all contact fields
   - Set appropriate customer type
   - Define credit limit for wholesale/distributor
   - Specify payment terms clearly

2. **Regular Maintenance**:
   - Update contact information as needed
   - Review credit limits quarterly
   - Deactivate inactive customers (don't delete)
   - Add notes for special requirements

3. **Credit Management**:
   - Monitor outstanding payments in Financial Reports
   - Follow up on overdue invoices (7+ days)
   - Adjust credit limits based on payment history

---

## External Invoice Integration

### How It Works

This system is designed to **complement** your existing invoice software, not replace it. Here's how they work together:

1. **Your Invoice Software** (e.g., QuickBooks, FreshBooks, Wave):
   - Creates professional invoices
   - Handles detailed tax calculations
   - Manages accounts receivable
   - Generates invoice numbers

2. **This Inventory System**:
   - Tracks physical stock levels
   - Records which products were sold
   - Links to your invoice numbers
   - Provides inventory-focused analytics

### Integration Workflow

```
Step 1: Customer Orders → Your Invoice Software
         ↓
Step 2: Invoice Created (INV-2024-001) → Keep number
         ↓
Step 3: Record Sale in Inventory System → Enter invoice number
         ↓
Step 4: Stock Automatically Updated
         ↓
Step 5: Both systems have linked records
```

### Benefits of This Approach

- **No Double Entry**: Products entered once in inventory system
- **Stock Accuracy**: Real-time stock levels
- **Easy Reconciliation**: Match invoice numbers between systems
- **Comprehensive Reporting**: Inventory + financial data combined
- **Flexibility**: Use any invoice software you prefer

### Data Export (Future Feature)

Plans for future releases include:
- CSV export of sales data
- Import sales from invoice software
- API integration with popular invoice platforms

---

## Troubleshooting

### Issue: Cannot Login

**Solution**:
1. Verify server is running: `http://localhost:3000/api/health`
2. Check database exists: `backend/database.sqlite`
3. Reset password: Run `npm run init-db-enhanced` (WARNING: Resets data)
4. Default credentials: `admin@inventory.local` / `password`

### Issue: Stock Not Updating After Sale

**Solution**:
1. Check product exists in database
2. Verify sale was created successfully (check Sales page)
3. Review stock movements for the product
4. Check server console for errors

### Issue: Customer Shows in Dropdown But Can't Select

**Solution**:
1. Verify customer is active (check Customers page)
2. Refresh the page
3. Check browser console for JavaScript errors

### Issue: Financial Reports Show No Data

**Solution**:
1. Verify date range includes sales
2. Check that sales have been recorded
3. Try expanding date range
4. Refresh the page

### Issue: Invoice Number Already Exists

**Solution**:
- Each invoice number must be unique
- Check if sale was already recorded
- Use a different invoice number
- Delete duplicate sale if needed

### Issue: Cannot Delete Customer

**Error**: "Cannot delete customer with existing sales"

**Solution**:
- Customers with sales history cannot be deleted
- Use "Deactivate" instead (edit customer, uncheck "Active")
- This preserves sales history while hiding customer

---

## Sample Data

The enhanced seed script creates:

### Sample Customers (5)
- ABC Company (Wholesale)
- Retail Store Inc (Retail)
- John Doe (Retail)
- XYZ Distributors (Distributor)
- Small Shop LLC (Retail)

### Sample Sales (5)
- INV-2024-001: $1,320.00 (Paid)
- INV-2024-002: $49.50 (Paid)
- INV-2024-003: $105.00 (Paid)
- INV-2024-004: $525.00 (Pending)
- INV-2024-005: $82.50 (Partial)

### Sample Products (10)
- Electronics (Laptop, Mouse, Keyboard)
- Clothing (T-Shirt, Jeans, Jacket)
- Food & Beverages (Coffee, Water)
- Home & Garden (Hammer)
- Sports (Soccer Ball)

---

## Default Login Credentials

**Admin Account**:
- Email: `admin@inventory.local`
- Password: `password`

**SECURITY WARNING**: Change this password immediately after first login!

---

## Support & Documentation

### Quick Links
- Dashboard: Main overview and metrics
- Products: Product catalog management
- Customers: Customer database
- Sales: Record and view sales
- Financial Reports: Analytics and insights
- Reports: Inventory reports
- Settings: Company configuration (Admin only)
- Users: User management (Admin only)

### Getting Help
1. Check this README first
2. Review the User Guide section
3. Check browser console for error messages
4. Check backend server logs
5. Verify database file exists and has correct permissions

---

## Version Information

**Current Version**: 2.0.0 (Enhanced)  
**Release Date**: November 2024  
**License**: MIT  
**Author**: MiniMax Agent

### What's New in v2.0

- Complete customer management system
- Sales recording with external invoice integration
- Financial reporting and analytics
- Profit analysis by product
- Customer analytics and insights
- Payment tracking and management
- Outstanding payments monitoring
- Enhanced dashboard with sales metrics
- Salesperson performance tracking
- Multiple payment methods support
- Credit limit management
- Customer categorization (Retail/Wholesale/Distributor)
- Full mobile optimization for sales entry

---

## Future Roadmap

### Planned Features
- Multi-location inventory support
- Barcode printing
- Purchase order management
- Vendor management enhancements
- Advanced reporting with charts
- Email notifications for low stock
- SMS notifications for payments
- Customer portal
- Invoice PDF generation
- Batch import/export
- API for third-party integration
- Mobile app (iOS/Android)
- Cloud backup options
- Multi-currency support
- Advanced tax calculations

---

## License

MIT License - Free for personal and commercial use

---

## Credits

Built with:
- **Backend**: Node.js, Express.js, SQLite3
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Authentication**: bcryptjs, express-session
- **UI Icons**: react-icons (Feather Icons)
- **HTTP Client**: axios
- **Routing**: react-router-dom

---

**Thank you for using the Enhanced Local Inventory Management System!**

For questions, issues, or feature requests, please refer to the troubleshooting section or consult the system documentation.
