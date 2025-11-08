# Inventory Management System

A comprehensive web-based inventory management system designed for tracking sewing machine parts, motors, and related industrial components with advanced features for warehouse operations.

## New Features (v2.0)

### Enhanced Authentication
- **No Email Verification Required** - Instant access for warehouse staff
- **Default Admin Account** - Pre-configured admin credentials (admin/admin)
- **Password Management** - Admins can reset user passwords
- **Role-Based Access** - Admin, Manager, and User roles

### Barcode Scanner Integration
- **Dual Entry Methods** - Camera scanning + USB scanner support
- **Quick Product Lookup** - Scan barcode to find or create products
- **Mobile-Friendly** - Camera-based scanning on tablets and phones
- **USB Scanner Support** - Works with keyboard emulation mode scanners

### Admin Panel
- **User Management** - Create, edit, and manage user accounts
- **Role Assignment** - Assign admin, manager, or user roles
- **User Activation** - Activate or deactivate user accounts
- **Password Reset** - Reset passwords for any user
- **Comprehensive Search** - Find users by name or email

### Local Deployment Support
- **Complete Installation Guide** - Step-by-step setup instructions
- **Self-Hosted Option** - Deploy on your own infrastructure
- **Docker Support** - Container-based deployment
- **Production Ready** - SSL/HTTPS configuration guides

## Core Features

- **User Authentication** - Secure login with role-based access (Admin/Manager/User)
- **Product Management** - Complete CRUD operations with search and filtering
- **Barcode Support** - Scan or manually enter product barcodes
- **Stock Tracking** - Real-time stock levels with movement history
- **Categories & Suppliers** - Organized product catalog
- **Low Stock Alerts** - Automatic notifications for reordering
- **Reports & Analytics** - Inventory insights and data export (CSV)
- **Mobile Responsive** - Optimized for warehouse use on tablets and phones
- **User Management** - Admin panel for managing users and permissions

## Quick Start

### Access the Application

Visit: **https://ctaq1m5il7uf.space.minimax.io**

### Default Admin Login

**Email:** `admin@inventory.local`  
**Password:** `password`

**IMPORTANT:** Change the admin password immediately after first login through User Management.

### For Local Installation

See [INSTALLATION.md](./INSTALLATION.md) for complete setup instructions.

## User Roles

### Admin
- Full system access
- User management capabilities
- Create, edit, delete users
- Reset user passwords
- Assign roles
- All inventory operations

### Manager
- Inventory management
- Reports access
- Product operations
- Cannot manage users

### User
- Basic operations
- View products
- Limited permissions

## Barcode Scanner Usage

### Method 1: USB Barcode Scanner

1. Connect USB scanner to computer
2. In Products page, click "Scan Barcode"
3. Choose "Manual Input" mode
4. Scan barcode with USB scanner
5. Press Enter or click "Use This Barcode"

### Method 2: Camera Scanner (Mobile)

1. In Products page, click "Scan Barcode"
2. Choose "Camera Scan" mode
3. Allow camera permissions when prompted
4. Point camera at barcode
5. System will auto-detect and scan

### Method 3: Manual Entry

1. Click "Scan Barcode" button
2. Choose "Manual Input" mode
3. Type barcode manually
4. Click "Use This Barcode"

## Default Sample Data

The system includes:
- 11 sample products with barcodes
- 5 product categories
- 3 suppliers
- Stock movement history
- Pre-configured admin account

## User Management

### Creating Users (Admin Only)

1. Navigate to User Management
2. Click "Add User"
3. Enter user details:
   - Email
   - Password
   - Full Name
   - Role (Admin/Manager/User)
4. Click "Create User"

### Editing Users

1. Find user in User Management
2. Click edit icon
3. Update user details
4. Save changes

### Resetting Passwords

1. Find user in User Management
2. Click key icon
3. Enter new password
4. Click "Reset Password"

### Activating/Deactivating Users

1. Find user in User Management
2. Click shield icon
3. User will be activated or deactivated

## Technology Stack

- **Frontend**: React 18 + TypeScript + TailwindCSS
- **Backend**: Supabase (PostgreSQL + Authentication + Edge Functions)
- **Barcode**: BarcodeDetector API (camera) + Keyboard emulation (USB)
- **Deployment**: Production-ready build with CDN

## User Guide

### Dashboard
- View key metrics at a glance
- Monitor low stock items
- Track inventory value
- Quick access to critical functions

### Products
- Add new products with barcode support
- Search by name, SKU, or barcode
- Filter by category
- Edit or delete existing products
- Track stock levels
- Barcode scanning for quick entry

### Stock Movements
- Record incoming stock (purchases, returns)
- Record outgoing stock (sales, usage)
- Make stock adjustments
- View complete movement history
- Track who made changes

### Reports
- Export full inventory to CSV
- Generate low stock reports
- Export stock movement history
- View inventory breakdown by category
- Analyze inventory trends

### User Management (Admin Only)
- Create new user accounts
- Assign roles and permissions
- Reset user passwords
- Activate/deactivate accounts
- Search and filter users

## Security Features

- Row Level Security (RLS) on all database tables
- Authentication required for all operations
- Role-based access control
- Secure password storage (bcrypt)
- Admin-only user management
- Audit logging for stock movements
- Secure edge functions for admin operations

## Mobile Support

The application is fully responsive and optimized for:
- Tablets (iPad, Android tablets)
- Smartphones (iPhone, Android phones)
- Desktop computers
- Touch-friendly interface
- Camera barcode scanning on mobile devices

## API Integration

### Edge Functions

The system uses Supabase Edge Functions for:
- User management operations (create, update, delete)
- Password reset functionality
- Admin permission checks
- Secure server-side operations

## Documentation

- **README.md** - This file (overview and quick start)
- **INSTALLATION.md** - Complete installation and deployment guide
- **USER-GUIDE.md** - Detailed user guide for end users
- **DEPLOYMENT.md** - Production deployment information

## Troubleshooting

### Cannot Login with Admin Account

1. Verify credentials: `admin@inventory.local` / `password`
2. Check Supabase authentication is enabled
3. Verify database migrations ran successfully

### Barcode Scanner Not Working

**Camera Scanner:**
- Ensure HTTPS is enabled (required for camera API)
- Grant camera permissions when prompted
- Use modern browser (Chrome, Safari, Edge)

**USB Scanner:**
- Ensure scanner is in keyboard emulation mode
- Test scanner in a text editor first
- Use "Manual Input" mode in the application

### User Management Not Available

- Ensure you're logged in as admin
- Check User Management appears in navigation menu
- Verify admin role in user profile

### Email Not Required

Email verification is **disabled by default** for warehouse use. Users can login immediately after account creation.

For detailed troubleshooting, see [INSTALLATION.md](./INSTALLATION.md#troubleshooting).

## Support

For issues or questions:

1. Check [INSTALLATION.md](./INSTALLATION.md) for setup help
2. Review [USER-GUIDE.md](./USER-GUIDE.md) for feature documentation
3. Check browser console for errors
4. Verify Supabase configuration
5. Test with default admin account

## Updates and Maintenance

### Latest Version: 2.0.0

**What's New:**
- Barcode scanner integration
- User management system
- Default admin account
- Enhanced authentication
- Local deployment support
- Comprehensive documentation

### Previous Version: 1.0.0
- Initial release with core inventory features

## License

Private use for inventory management operations.

## Credits

Built with:
- React & TypeScript
- Supabase
- TailwindCSS
- Lucide Icons

---

**Last Updated:** 2025-11-06  
**Version:** 2.0.0
