# QUICK START GUIDE - Enhanced Local Inventory System

## Installation in 3 Easy Steps

### Prerequisites
- Node.js 16.x or higher ([Download here](https://nodejs.org/))
- npm (comes with Node.js) or pnpm
- 50MB free disk space

---

## Automated Installation (Recommended)

### On Linux/Mac:
```bash
cd /workspace/local-inventory-system
chmod +x setup-enhanced.sh start-enhanced.sh
./setup-enhanced.sh
./start-enhanced.sh
```

### On Windows:
```cmd
cd C:\path\to\local-inventory-system
setup-enhanced.bat
start-enhanced.bat
```

**That's it!** The system will be available at `http://localhost:3000`

---

## Manual Installation (Alternative)

### Step 1: Backend Setup
```bash
cd backend

# Install dependencies
npm install
# OR
pnpm install

# Initialize database
npm run init-db-enhanced

# Load sample data (optional)
npm run seed-enhanced
```

### Step 2: Frontend Setup
```bash
cd ../frontend/inventory-frontend

# Install dependencies
npm install
# OR
pnpm install

# Build for production
npm run build
```

### Step 3: Start the Server
```bash
cd ../../backend
npm start
```

Access the system at: `http://localhost:3000`

---

## First Login

**URL**: http://localhost:3000

**Default Credentials**:
- Email: `admin@inventory.local`
- Password: `password`

⚠️ **CRITICAL**: Change this password immediately after first login!

---

## What You Get

### Sample Data (Pre-loaded)

**5 Sample Customers**:
- ABC Company (Wholesale) - $50,000 credit limit
- Retail Store Inc (Retail) - $10,000 credit limit
- John Doe (Retail) - Walk-in customer
- XYZ Distributors (Distributor) - $100,000 credit limit
- Small Shop LLC (Retail) - $5,000 credit limit

**10 Sample Products**:
- Laptop Computer - $1,200
- Wireless Mouse - $25
- Mechanical Keyboard - $100
- Cotton T-Shirt - $20
- Blue Jeans - $50
- Winter Jacket - $150
- Premium Coffee - $25
- Bottled Water (24-pack) - $10
- Steel Hammer - $35
- Soccer Ball - $30

**5 Sample Sales**:
- INV-2024-001: $1,320.00 (Paid)
- INV-2024-002: $49.50 (Paid)
- INV-2024-003: $105.00 (Paid)
- INV-2024-004: $525.00 (Pending)
- INV-2024-005: $82.50 (Partial Payment)

---

## Quick Tour

### 1. Dashboard
- View overall statistics
- See low stock alerts
- Check recent sales
- Monitor pending payments

### 2. Customer Management
**Navigate to: Customers**
- View all customers
- Add new customer
- Edit customer details
- View customer purchase history

### 3. Record a Sale
**Navigate to: Sales → + Record Sale**

Steps:
1. Enter invoice number from your invoice software (e.g., INV-2024-006)
2. Select customer (or leave blank for walk-in)
3. Add products:
   - Select product from dropdown
   - Enter quantity
   - Apply discount if needed
   - Click "+ Add Item" for more products
4. Review totals (subtotal, discount, tax, total)
5. Set payment status (pending/paid/partial)
6. Select payment method
7. Click "Record Sale"

Result: Stock levels automatically updated!

### 4. Financial Reports
**Navigate to: Financial Reports**

Explore:
- **Sales Analysis**: Revenue trends, top products
- **Profit Analysis**: Product profitability, margins
- **Customer Analytics**: Top customers, spending patterns
- **Payments**: Outstanding invoices, payment methods

---

## How External Invoice Integration Works

### Your Workflow:

**Step 1 - In Your Invoice Software** (QuickBooks, FreshBooks, etc.):
- Create invoice as usual
- Note the invoice number: `INV-2024-006`

**Step 2 - In This Inventory System**:
- Go to Sales → Record Sale
- Enter the same invoice number: `INV-2024-006`
- Add products sold
- Save

**Result**:
- Both systems have matching records
- Your invoice software handles billing
- This system tracks inventory
- Easy reconciliation via invoice numbers

---

## Troubleshooting

### Backend won't start
```bash
# Check if database exists
ls backend/database.sqlite

# If missing, run:
cd backend
npm run init-db-enhanced
npm run seed-enhanced
```

### Port 3000 already in use
```bash
# Find what's using port 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change port in backend/.env
```

### Cannot login
- Verify backend is running: Visit `http://localhost:3000/api/health`
- Should return: `{"status":"ok","timestamp":"..."}`
- Clear browser cache
- Try incognito/private mode

### Forgot password
```bash
cd backend
rm database.sqlite
npm run init-db-enhanced
# This resets to default: admin@inventory.local / password
# WARNING: Deletes all data!
```

---

## Development Mode (Optional)

Run frontend with hot reload:
```bash
cd frontend/inventory-frontend
npm run dev
```
Access at: `http://localhost:5173`

Backend will still run on: `http://localhost:3000`

---

## File Structure

```
local-inventory-system/
├── setup-enhanced.sh       # Automated setup (Linux/Mac)
├── setup-enhanced.bat      # Automated setup (Windows)
├── start-enhanced.sh       # Start script (Linux/Mac)
├── start-enhanced.bat      # Start script (Windows)
├── README-ENHANCED.md      # Full documentation (634 lines)
├── INSTALLATION-ENHANCED.md # Detailed setup guide
├── DELIVERY-SUMMARY.md     # Feature summary
│
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   │   ├── initDatabaseEnhanced.js
│   │   │   └── seedDataEnhanced.js
│   │   ├── controllers/
│   │   │   ├── customersController.js (NEW)
│   │   │   ├── salesController.js (NEW)
│   │   │   ├── paymentsController.js (NEW)
│   │   │   └── ... (11 controllers total)
│   │   └── routes/
│   │       ├── customers.js (NEW)
│   │       ├── sales.js (NEW)
│   │       ├── payments.js (NEW)
│   │       └── ... (11 routes total)
│   └── database.sqlite (created on setup)
│
└── frontend/inventory-frontend/
    ├── package.json
    ├── src/
    │   ├── pages/
    │   │   ├── Customers/CustomersPage.tsx (NEW)
    │   │   ├── Sales/SalesPage.tsx (NEW)
    │   │   ├── FinancialReports/FinancialReportsPage.tsx (NEW)
    │   │   └── ... (9 pages total)
    │   ├── services/api.ts (Enhanced)
    │   └── types/index.ts (Enhanced)
    └── dist/ (created on build)
```

---

## Next Steps

1. **Customize Company Settings**
   - Go to Settings (Admin only)
   - Update company name, address, phone
   - Set tax rate for your region
   - Upload company logo

2. **Add Your Products**
   - Go to Products
   - Add your actual inventory
   - Set cost and selling prices
   - Define minimum stock levels

3. **Add Your Customers**
   - Go to Customers
   - Create customer profiles
   - Set credit limits
   - Define payment terms

4. **Start Recording Sales**
   - Use your existing invoice software
   - Record sales in this system with matching invoice numbers
   - Track inventory automatically

5. **Monitor Reports**
   - Check Financial Reports daily
   - Track top products
   - Monitor outstanding payments
   - Analyze profit margins

---

## Support

### Documentation:
- **Full Guide**: `README-ENHANCED.md` (634 lines)
- **Installation**: `INSTALLATION-ENHANCED.md` (389 lines)
- **Features**: `DELIVERY-SUMMARY.md` (569 lines)

### Common Issues:
1. Dependencies won't install → Check Node.js version (need 16+)
2. Database errors → Delete database.sqlite and re-run setup
3. Cannot login → Check backend is running, try default credentials
4. Port conflicts → Change port in backend/.env

---

## Production Deployment

For production use:

1. **Set Environment Variables** (`backend/.env`):
```
NODE_ENV=production
PORT=3000
SESSION_SECRET=your-very-secure-random-string-here-change-this
```

2. **Security Checklist**:
- [ ] Change default admin password
- [ ] Set strong SESSION_SECRET
- [ ] Use HTTPS in production
- [ ] Regular database backups
- [ ] Restrict file permissions
- [ ] Keep dependencies updated

3. **Backup Strategy**:
```bash
# Backup database
cp backend/database.sqlite backup/database-$(date +%Y%m%d).sqlite

# Backup uploaded files
cp -r backend/uploads backup/uploads-$(date +%Y%m%d)
```

---

## System Requirements

**Minimum**:
- Node.js 16.x
- 512MB RAM
- 50MB disk space
- Modern web browser

**Recommended**:
- Node.js 18.x or higher
- 1GB RAM
- 500MB disk space
- Latest Chrome, Firefox, or Edge

---

## License

MIT License - Free for personal and commercial use

---

## Version

**Enhanced Version 2.0.0**  
Released: November 2024  
Author: MiniMax Agent

---

**Ready to start? Run the setup script and you'll be recording sales in minutes!**

For detailed documentation, see `README-ENHANCED.md`
