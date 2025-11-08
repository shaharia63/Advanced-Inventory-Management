# Local Inventory Management System - User Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Product Management](#product-management)
4. [Categories & Suppliers](#categories--suppliers)
5. [Stock Movements](#stock-movements)
6. [Reports](#reports)
7. [User Management (Admin Only)](#user-management)
8. [Company Settings (Admin Only)](#company-settings)
9. [Mobile Usage](#mobile-usage)
10. [Troubleshooting](#troubleshooting)

## Getting Started

### First Login

1. Open your web browser
2. Navigate to `http://localhost:5173`
3. Enter the default credentials:
   - **Email**: `admin@inventory.local`
   - **Password**: `password`
4. Click **Sign In**

### Changing Your Password

1. As admin, go to **Settings** page
2. Or use the **User Management** page to reset any user's password
3. Always use strong, unique passwords

## Dashboard

The Dashboard provides an overview of your inventory system.

### Key Metrics
- **Total Products**: Total number of items in inventory
- **Low Stock Items**: Products below minimum stock level
- **Stock Value**: Total cost value of inventory
- **Recent Movements**: Stock movements in last 7 days
- **Categories**: Total product categories
- **Suppliers**: Total suppliers

### Quick Actions
- Add New Product
- Record Stock Movement
- View Low Stock Alerts
- View Reports

## Product Management

### Viewing Products

1. Click **Products** in the navigation menu
2. All products are displayed in a card grid
3. Use the search bar to find products by name, SKU, or barcode
4. Filter by category using the dropdown
5. Check "Low Stock Only" to see items needing restock

### Adding a New Product

1. Click **Add Product** button
2. Fill in the required fields:
   - **SKU** (required): Unique product identifier
   - **Product Name** (required): Descriptive name
   - **Barcode**: Optional barcode number
   - **Description**: Product details
   - **Category**: Select from list
   - **Supplier**: Select from list
   - **Cost Price**: Purchase price
   - **Selling Price**: Sale price
   - **Stock Quantity**: Current stock level
   - **Min Level**: Minimum stock before alert
   - **Location**: Warehouse location
   - **Manufacturer**: Brand or maker
3. Click **Create** to save

### Using Barcode Scanner

1. Click the **Scan** button (camera icon)
2. Allow camera access when prompted
3. Point camera at barcode
4. If found, product details will load for editing
5. If not found, you can create a new product with that barcode

### Editing a Product

1. Find the product you want to edit
2. Click **Edit** button on the product card
3. Modify the information
4. Click **Update** to save changes

### Deleting a Product

1. Find the product to delete
2. Click **Delete** button
3. Confirm the deletion when prompted
4. **Warning**: This action cannot be undone

## Categories & Suppliers

### Managing Categories

1. Navigate to **Categories** page
2. **Add Category**:
   - Click **Add Category** button
   - Enter category name and description
   - Click **Create**
3. **Edit Category**:
   - Click **Edit** on any category
   - Update information
   - Click **Update**
4. **Delete Category**:
   - Click **Delete** button
   - Confirm deletion

### Managing Suppliers

1. Navigate to **Suppliers** page
2. **Add Supplier**:
   - Click **Add Supplier** button
   - Enter supplier details:
     - Name (required)
     - Contact person
     - Phone
     - Email
     - Address
   - Click **Create**
3. **Edit/Delete**: Same process as categories

## Stock Movements

Stock movements track all inventory changes.

### Types of Movements

- **Incoming**: Receiving new stock from suppliers
- **Outgoing**: Sales, usage, or shipments
- **Adjustment**: Inventory corrections after audits

### Recording a Stock Movement

1. Go to **Stock Movements** page
2. Click **Add Movement**
3. Fill in the details:
   - **Product**: Select from dropdown
   - **Movement Type**: Choose incoming/outgoing/adjustment
   - **Quantity**: Number of units
   - **Reference**: PO number, invoice, etc.
   - **Notes**: Additional information
4. Click **Create**

### Viewing Movement History

- All movements are displayed in chronological order
- Each entry shows:
  - Date and time
  - Product name
  - Movement type (color-coded)
  - Quantity
  - Reference number
  - User who recorded it

## Reports

### Dashboard Statistics

View real-time metrics on the Dashboard page.

### Low Stock Alerts

1. Navigate to **Reports** page
2. The "Low Stock Alerts" section shows products below minimum level
3. Click on any product to view details
4. Take action to reorder from suppliers

### Inventory Value Report

Shows the total value of your inventory:
- **Total Items**: Number of products
- **Total Cost Value**: Purchase cost of all stock
- **Total Selling Value**: Potential revenue

### Exporting Data

1. Go to **Reports** page
2. Click **Export CSV** button
3. Save the CSV file to your computer
4. Open in Excel or Google Sheets for analysis

## User Management

**Note**: Only available to Admin users

### Viewing Users

1. Navigate to **Users** page (admin only)
2. See all user accounts with:
   - Name and email
   - Role (Admin/Manager/User)
   - Active status

### Creating a User

1. Click **Add User** button
2. Enter user details:
   - **Email**: Login email address
   - **Password**: Initial password (min 6 characters)
   - **Name**: Full name
   - **Role**: Select appropriate role
   - **Active**: Check to enable account
3. Click **Create**

### Editing a User

1. Click **Edit** on any user card
2. Update user information
3. **Note**: Cannot change password here
4. Click **Update**

### Resetting User Password

1. Click **Reset** button on user card
2. Enter new password (min 6 characters)
3. Confirm
4. Inform the user of their new password

### Deleting a User

1. Click **Delete** button
2. Confirm deletion
3. **Note**: Cannot delete your own account

## Company Settings

**Note**: Only available to Admin users

### Updating Company Information

1. Navigate to **Settings** page
2. Update the following fields:
   - Company Name
   - Address
   - Phone
   - Email
3. Click **Save Changes**

### Managing Company Logo

**Uploading a Logo:**
1. Click **Choose File**
2. Select an image file (JPG, PNG, GIF)
3. Click **Upload**
4. Logo will appear on reports and documents

**Deleting a Logo:**
1. Click **Delete Logo** button
2. Confirm deletion

## Mobile Usage

### Accessing on Mobile

1. Open your mobile browser
2. Navigate to `http://localhost:5173`
3. Login with your credentials
4. Use the hamburger menu (≡) to navigate

### Mobile Features

- **Responsive Design**: Automatically adjusts to screen size
- **Touch-Friendly**: Large buttons and easy navigation
- **Barcode Scanning**: Use device camera for scanning
- **Quick Actions**: Fast access to common tasks

### Barcode Scanning on Mobile

1. Tap **Products** in menu
2. Tap the **Scan** button (camera icon)
3. Allow camera access
4. Position barcode in the frame
5. Product loads automatically

### Mobile Tips

- Use landscape mode for tables
- Zoom in/out as needed
- Use search instead of scrolling
- Close mobile menu after selection

## Troubleshooting

### Cannot Login

- Verify backend server is running
- Check credentials are correct
- Clear browser cookies
- Try a different browser
- Reset password if needed

### Products Not Loading

- Check internet connection (if applicable)
- Refresh the page
- Check backend server status
- Clear browser cache

### Barcode Scanner Not Working

- Allow camera permissions
- Check camera is not being used by another app
- Try different lighting conditions
- Ensure barcode is clear and visible
- Use manual entry as fallback

### Data Not Saving

- Check you have proper permissions (Manager/Admin)
- Verify all required fields are filled
- Check for error messages
- Try logging out and back in

### Mobile Issues

- Use latest browser version
- Clear mobile browser cache
- Check mobile data/WiFi connection
- Try desktop view if needed

## Best Practices

### Inventory Management

1. **Regular Audits**: Periodically verify physical stock matches system
2. **Timely Updates**: Record movements immediately
3. **Accurate Data**: Double-check quantities and prices
4. **Use References**: Always add PO numbers or invoice references
5. **Monitor Low Stock**: Check alerts daily

### Data Security

1. **Strong Passwords**: Use complex, unique passwords
2. **Regular Backups**: Backup database weekly
3. **User Permissions**: Assign appropriate roles
4. **Logout**: Always logout on shared computers
5. **Password Changes**: Change passwords regularly

### System Maintenance

1. **Keep Updated**: Install updates when available
2. **Database Backup**: Backup before major changes
3. **Monitor Performance**: Watch for slow operations
4. **Clean Old Data**: Archive old stock movements
5. **User Audit**: Review user accounts monthly

## Keyboard Shortcuts

- **Ctrl/Cmd + K**: Focus search bar
- **Esc**: Close modal dialogs
- **Tab**: Navigate form fields
- **Enter**: Submit forms

## Getting Help

If you encounter issues:

1. Check this user guide
2. Review error messages carefully
3. Check server logs for errors
4. Contact your system administrator
5. Refer to technical documentation

## Glossary

- **SKU**: Stock Keeping Unit - unique product identifier
- **Barcode**: Machine-readable product code
- **Stock Movement**: Any change in inventory level
- **Low Stock**: Product below minimum threshold
- **Audit Log**: Record of all system activities
- **Role**: User permission level (Admin/Manager/User)

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-06  
**Support**: Contact your system administrator
