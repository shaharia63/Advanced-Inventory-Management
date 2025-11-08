# Enhanced Inventory System - Quick Setup Guide

## What's New in This Enhanced Version

This enhanced version adds comprehensive **Sales Tracking** and **Customer Management** capabilities to the existing inventory system, with support for external invoice software integration.

### New Features Summary:
1. **Customer Management**: Complete customer database with profiles, contact info, and categorization
2. **Sales Recording**: Link external invoice numbers from your existing invoice software
3. **Financial Reports**: Sales analytics, profit analysis, customer insights, payment tracking
4. **Payment Management**: Track payment status, methods, and outstanding invoices
5. **Salesperson Tracking**: Monitor individual sales performance

---

## Prerequisites

- Node.js 16.x or higher
- npm or pnpm package manager
- Modern web browser
- 50MB disk space

---

## Installation Steps

### 1. Backend Installation

```bash
cd local-inventory-system/backend

# Install dependencies
npm install
# OR
pnpm install

# Initialize the enhanced database with all tables
npm run init-db-enhanced

# (Optional) Load sample data for testing
npm run seed-enhanced

# Start the backend server
npm start
```

Server will run on: `http://localhost:3000`

### 2. Frontend Installation

```bash
cd local-inventory-system/frontend/inventory-frontend

# Install dependencies
npm install
# OR
pnpm install

# For development
npm run dev

# For production build
npm run build
```

Development server: `http://localhost:5173`  
Production: Served by backend at `http://localhost:3000`

---

## First Login

Navigate to `http://localhost:3000` (or `http://localhost:5173` in dev mode)

**Default Admin Credentials**:
- Email: `admin@inventory.local`
- Password: `password`

**IMPORTANT**: Change the password immediately after first login!

---

## Quick Start Workflow

### 1. Setup Your Company (Admin Only)
1. Go to **Settings**
2. Enter company name, address, contact
3. Set tax rate (default: 10%)
4. Save settings

### 2. Add Your First Customer
1. Navigate to **Customers**
2. Click **+ Add Customer**
3. Fill in:
   - Name (required)
   - Customer Type (Retail/Wholesale/Distributor)
   - Contact information
   - Address
   - Payment terms
4. Click **Add Customer**

### 3. Record Your First Sale
1. Navigate to **Sales**
2. Click **+ Record Sale**
3. **Enter Invoice Number** (from your invoice software)
4. Select customer (or leave blank for walk-in)
5. Add products:
   - Select product
   - Enter quantity
   - Apply discount if needed
   - Click **+ Add Item** for more products
6. Review totals
7. Set payment status and method
8. Click **Record Sale**

Stock levels update automatically!

### 4. View Financial Reports
1. Navigate to **Financial Reports**
2. Select date range
3. Explore:
   - Sales Analysis
   - Profit Analysis
   - Customer Analytics
   - Payment Tracking

---

## How External Invoice Integration Works

This system **complements** your existing invoice software:

### Your Workflow:
1. **Create invoice in your invoice software** (QuickBooks, FreshBooks, etc.)
   - Generate invoice number: `INV-2024-001`
2. **Record the sale in this inventory system**
   - Enter the same invoice number: `INV-2024-001`
   - Add products sold
   - Link to customer
3. **Both systems stay synchronized**
   - Your invoice software handles billing
   - This system tracks inventory and stock levels
   - Easy reconciliation using invoice numbers

### Benefits:
- Real-time stock tracking
- No need to change your invoicing workflow
- Link inventory to billing records
- Comprehensive analytics combining both data sources

---

## Sample Data (Optional)

Running `npm run seed-enhanced` creates:
- 5 sample customers (retail, wholesale, distributor types)
- 10 products across various categories
- 5 sample sales with different payment statuses
- Stock movements and payment records

This is helpful for testing and learning the system.

---

## Navigation Overview

### Main Menu Items:
- **Dashboard**: Overview with key metrics (now includes sales stats)
- **Products**: Manage product catalog
- **Categories**: Product categorization
- **Suppliers**: Supplier management
- **Stock Movements**: Track stock changes
- **Customers** (NEW): Customer database
- **Sales** (NEW): Record and view sales
- **Financial Reports** (NEW): Sales and profit analytics
- **Inventory Reports**: Stock reports and analytics
- **Users** (Admin): User management
- **Settings** (Admin): Company settings

---

## Database Schema Changes

### New Tables Added:
1. **customers** - Customer profiles and contact info
2. **sales** - Sales transactions with invoice numbers
3. **sales_items** - Individual products per sale
4. **payments** - Payment tracking
5. **sales_returns** - Return management (ready for future use)

### Enhanced Tables:
- **stock_movements**: Added fields for sale tracking
- **users**: Added salesperson commission fields
- **company_settings**: Added tax rate and currency

---

## API Endpoints (New)

### Customers
```
GET    /api/customers
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
GET    /api/customers/:id/sales
GET    /api/customers/:id/stats
```

### Sales
```
GET    /api/sales
POST   /api/sales
PUT    /api/sales/:id/status
DELETE /api/sales/:id
GET    /api/sales/summary
```

### Payments
```
GET    /api/payments
POST   /api/payments
PUT    /api/payments/:id
DELETE /api/payments/:id
```

### Financial Reports
```
GET    /api/reports/sales-report
GET    /api/reports/top-selling
GET    /api/reports/customer-analytics
GET    /api/reports/profit-analysis
GET    /api/reports/payment-methods
GET    /api/reports/salesperson-performance
GET    /api/reports/outstanding-payments
```

---

## Troubleshooting

### Backend won't start
- Check if database file exists: `backend/database.sqlite`
- Verify Node.js is installed: `node --version`
- Check port 3000 is available
- Review console for error messages

### Frontend build fails
- Ensure all dependencies installed: `npm install`
- Check Node.js version: 16.x or higher required
- Clear cache: `rm -rf node_modules && npm install`

### Can't login
- Use default credentials: `admin@inventory.local` / `password`
- Check backend is running: Visit `http://localhost:3000/api/health`
- Clear browser cache and cookies

### Database reset needed
```bash
cd backend
rm database.sqlite
npm run init-db-enhanced
npm run seed-enhanced
```
**WARNING**: This deletes all data!

---

## File Structure

```
local-inventory-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── initDatabase.js (original)
│   │   │   ├── initDatabaseEnhanced.js (NEW - enhanced schema)
│   │   │   ├── seedData.js (original)
│   │   │   └── seedDataEnhanced.js (NEW - sample customers & sales)
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productsController.js
│   │   │   ├── customersController.js (NEW)
│   │   │   ├── salesController.js (NEW)
│   │   │   ├── paymentsController.js (NEW)
│   │   │   └── reportsController.js (ENHANCED)
│   │   ├── routes/
│   │   │   ├── customers.js (NEW)
│   │   │   ├── sales.js (NEW)
│   │   │   ├── payments.js (NEW)
│   │   │   └── reports.js (ENHANCED)
│   │   ├── middleware/
│   │   └── server.js (ENHANCED)
│   ├── package.json (ENHANCED)
│   └── database.sqlite (created on init)
│
├── frontend/inventory-frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Customers/CustomersPage.tsx (NEW)
│   │   │   ├── Sales/SalesPage.tsx (NEW)
│   │   │   ├── FinancialReports/FinancialReportsPage.tsx (NEW)
│   │   │   └── ... (existing pages)
│   │   ├── services/
│   │   │   └── api.ts (ENHANCED - new endpoints)
│   │   ├── types/
│   │   │   └── index.ts (ENHANCED - new types)
│   │   ├── components/
│   │   │   └── Layout/Layout.tsx (ENHANCED - new menu items)
│   │   └── App.tsx (ENHANCED - new routes)
│   └── package.json
│
├── README-ENHANCED.md (NEW - this file's detailed version)
└── INSTALLATION-ENHANCED.md (NEW - this file)
```

---

## Support & Next Steps

### Learn More:
1. Read the full `README-ENHANCED.md` for detailed documentation
2. Explore the sample data to understand features
3. Customize for your business needs

### Getting Help:
1. Check troubleshooting section
2. Review browser console for errors
3. Check backend logs for API errors
4. Verify database file exists and has data

---

## Production Deployment

### For Production Use:

1. **Environment Variables**:
   Create `backend/.env`:
   ```
   NODE_ENV=production
   PORT=3000
   SESSION_SECRET=your-secure-random-string-here
   FRONTEND_URL=https://your-domain.com
   ```

2. **Build Frontend**:
   ```bash
   cd frontend/inventory-frontend
   npm run build
   ```

3. **Start Backend**:
   ```bash
   cd backend
   npm start
   ```

4. **Access**: Navigate to `http://localhost:3000`

### Security Checklist:
- [ ] Change default admin password
- [ ] Set strong SESSION_SECRET in .env
- [ ] Use HTTPS in production
- [ ] Regular database backups
- [ ] Restrict file permissions on database.sqlite
- [ ] Keep dependencies updated

---

## Summary

This enhanced version transforms your inventory system into a comprehensive business management tool with:
- Full customer relationship management
- Sales tracking with external invoice integration
- Financial analytics and reporting
- Mobile-optimized interface
- Complete audit trail

The system works alongside your existing invoice software, providing the inventory tracking and analytics you need without disrupting your billing workflow.

**Ready to get started? Follow the installation steps above!**

---

**Version**: 2.0.0 Enhanced  
**Author**: MiniMax Agent  
**Date**: November 2024  
**License**: MIT
