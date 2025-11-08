# Installation Guide - Local Inventory Management System

## System Requirements

### Required Software
- **Node.js**: Version 18.0 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js installation
- **Web Browser**: Chrome, Firefox, Safari, or Edge (latest version)

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: Minimum 2GB available
- **Disk Space**: 500MB for application and database
- **Screen Resolution**: 1024x768 or higher (responsive down to 320px mobile)

## Quick Installation (Recommended)

### Step 1: Download and Extract

1. Extract the `local-inventory-system.zip` file to your desired location
2. Open terminal/command prompt in the extracted folder

### Step 2: Automated Installation

**On Windows:**
```cmd
setup.bat
```

**On macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

The setup script will:
- Install all backend dependencies
- Install all frontend dependencies
- Initialize the SQLite database
- Create default admin user
- Load sample data

### Step 3: Start the Application

**On Windows:**
```cmd
start.bat
```

**On macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

### Step 4: Access the System

1. Open your web browser
2. Navigate to: `http://localhost:5173`
3. Login with default credentials:
   - **Email**: `admin@inventory.local`
   - **Password**: `password`

**IMPORTANT**: Change the default password immediately after first login!

## Manual Installation

If the automated scripts don't work, follow these manual steps:

### Backend Installation

1. Open terminal in the project root folder
2. Navigate to backend:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Copy environment file:
   ```bash
   cp .env.example .env
   ```
   (On Windows: `copy .env.example .env`)

5. Initialize database:
   ```bash
   npm run init-db
   ```

6. Load sample data:
   ```bash
   npm run seed
   ```

7. Start backend server:
   ```bash
   npm start
   ```

The backend server will start on `http://localhost:3000`

### Frontend Installation

1. Open a **NEW** terminal window
2. Navigate to frontend:
   ```bash
   cd frontend/inventory-frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:5173`

## Verification

After installation, verify the system is working:

1. **Backend Health Check**:
   - Open: `http://localhost:3000/api/health`
   - Should show: `{"status":"ok","timestamp":"..."}`

2. **Frontend Access**:
   - Open: `http://localhost:5173`
   - Should see login page

3. **Login Test**:
   - Email: `admin@inventory.local`
   - Password: `password`
   - Should redirect to Dashboard

## Configuration

### Backend Configuration

Edit `backend/.env` to customize:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Session Configuration
SESSION_SECRET=change-this-to-a-random-secret-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration

Edit `frontend/inventory-frontend/.env` to customize:

```env
VITE_API_URL=http://localhost:3000/api
```

## Default Data

The system comes pre-configured with:

### Admin User
- Email: `admin@inventory.local`
- Password: `password`
- Role: Admin (full system access)

### Sample Categories
- Electronics
- Office Supplies
- Tools
- Furniture
- Safety Equipment

### Sample Suppliers
- Global Tech Supplies
- Office World
- Industrial Partners

### Sample Products
- 10 pre-configured products with stock levels
- Various categories and suppliers
- Sample barcodes for testing

## Production Deployment

For production use on a local network:

### 1. Update Configuration

**Backend** (`backend/.env`):
```env
NODE_ENV=production
SESSION_SECRET=generate-a-secure-random-string-here
FRONTEND_URL=http://your-server-ip:5173
```

**Frontend** (`frontend/inventory-frontend/.env`):
```env
VITE_API_URL=http://your-server-ip:3000/api
```

### 2. Build Frontend

```bash
cd frontend/inventory-frontend
npm run build
```

This creates an optimized production build in `dist/` folder.

### 3. Configure Backend to Serve Frontend

The backend is already configured to serve the built frontend in production mode.

Copy the built files:
```bash
cp -r frontend/inventory-frontend/dist backend/dist
```
(On Windows: `xcopy frontend\inventory-frontend\dist backend\dist /E /I`)

### 4. Start Production Server

```bash
cd backend
NODE_ENV=production npm start
```

Access the application at: `http://your-server-ip:3000`

### 5. Use Process Manager (Optional)

For automatic restart and monitoring, use PM2:

```bash
npm install -g pm2
cd backend
pm2 start src/server.js --name inventory-system
pm2 save
pm2 startup
```

## Network Access

To allow access from other devices on your network:

### Find Your IP Address

**Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address"

**macOS/Linux:**
```bash
ifconfig | grep inet
```
or
```bash
hostname -I
```

### Configure Firewall

Allow inbound connections on ports:
- 3000 (backend)
- 5173 (frontend dev) or 3000 (production)

### Access from Other Devices

On other devices, use your server's IP:
- `http://192.168.1.100:5173` (replace with your IP)

## Troubleshooting

### Issue: Port Already in Use

**Error**: "Port 3000 is already in use"

**Solution**:
1. Change port in `backend/.env`:
   ```env
   PORT=3001
   ```
2. Update frontend API URL accordingly

### Issue: Cannot Connect to Backend

**Solution**:
1. Verify backend is running: `http://localhost:3000/api/health`
2. Check firewall settings
3. Verify `FRONTEND_URL` in backend `.env`
4. Check browser console for CORS errors

### Issue: Database Lock Error

**Error**: "Database is locked"

**Solution**:
1. Stop all instances of the application
2. Delete `database.sqlite` file
3. Run `npm run init-db` and `npm run seed` again

### Issue: npm Install Fails

**Solution**:
1. Update Node.js to latest version
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` folder
4. Run `npm install` again

### Issue: Permission Denied (Linux/macOS)

**Solution**:
```bash
sudo chown -R $USER:$USER .
chmod +x setup.sh start.sh
```

## Database Management

### Backup Database

```bash
cp database.sqlite backup/database-$(date +%Y%m%d).sqlite
```

Also backup the uploads folder:
```bash
cp -r backend/uploads backup/uploads-$(date +%Y%m%d)
```

### Restore Database

1. Stop the application
2. Replace `database.sqlite` with backup file
3. Restore uploads folder if needed
4. Restart the application

### Reset Database

To start fresh:

```bash
cd backend
rm ../database.sqlite
npm run init-db
npm run seed
```

## Security Best Practices

### 1. Change Default Password

Immediately after installation:
1. Login as admin
2. Go to User Management
3. Click "Reset" on admin user
4. Set a strong password

### 2. Secure Session Secret

Generate a random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `backend/.env`:
```env
SESSION_SECRET=your-generated-secret-here
```

### 3. Regular Backups

Set up automatic daily backups:
- Database file
- Uploads folder
- Configuration files

### 4. Update Dependencies

Regularly update packages:
```bash
cd backend && npm update
cd ../frontend/inventory-frontend && npm update
```

### 5. Restrict Access

For production:
- Use firewall rules to restrict access
- Consider VPN for remote access
- Enable HTTPS with SSL certificates

## Mobile Device Access

### Same WiFi Network

1. Find server IP address (see Network Access section)
2. On mobile device, open browser
3. Navigate to: `http://server-ip:5173`
4. Save as home screen app for easy access

### Mobile Tips

- Use landscape mode for tables
- Enable camera permissions for barcode scanning
- Add to home screen for app-like experience

## Upgrading

To upgrade to a new version:

1. **Backup Everything**:
   - Database file
   - Uploads folder
   - Configuration files

2. **Download New Version**

3. **Replace Files**:
   - Keep `database.sqlite`
   - Keep `backend/uploads/`
   - Keep `.env` files
   - Replace all other files

4. **Update Dependencies**:
   ```bash
   cd backend && npm install
   cd ../frontend/inventory-frontend && npm install
   ```

5. **Restart Application**

## Support Checklist

Before requesting support, check:

- [ ] Node.js version is 18.0 or higher
- [ ] All dependencies installed successfully
- [ ] Database initialized without errors
- [ ] Backend health check returns OK
- [ ] Frontend loads without console errors
- [ ] Firewall allows required ports
- [ ] Browser is supported and updated

## Additional Resources

- **README.md**: Overview and features
- **USER_GUIDE.md**: Complete user manual
- **Backend API**: `backend/src/routes/` for API documentation
- **Frontend Components**: `frontend/inventory-frontend/src/components/`

## Getting Help

Common issues and solutions:
1. Check this installation guide
2. Review error messages carefully
3. Check server console logs
4. Verify configuration files
5. Try manual installation steps

## System Files Location

After installation, important files:

```
local-inventory-system/
├── database.sqlite          # SQLite database (backup this!)
├── backend/
│   ├── .env                # Backend configuration
│   ├── uploads/logos/      # Company logo storage
│   └── src/                # Backend source code
├── frontend/
│   └── inventory-frontend/
│       ├── .env            # Frontend configuration
│       ├── dist/           # Production build
│       └── src/            # Frontend source code
└── setup.sh / setup.bat    # Installation scripts
```

## Next Steps

After successful installation:

1. **Change default password**
2. **Configure company settings**
3. **Create user accounts**
4. **Add your categories**
5. **Add your suppliers**
6. **Start adding products**
7. **Set up regular backups**

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-06  
**Installation Support**: Refer to troubleshooting section above
