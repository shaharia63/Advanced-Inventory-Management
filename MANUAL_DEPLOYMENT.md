# Manual Deployment Instructions

## Frontend Deployment Status: COMPLETE ✓

**New Deployment URL**: https://zxud8w7y5opf.space.minimax.io

## Backend Deployment Required

Due to Supabase token limitations, the following steps must be completed manually through the Supabase Dashboard.

### Step 1: Apply Database Migrations

**Navigate to**: Supabase Dashboard > SQL Editor > New Query

#### Migration 1: Barcode Index and Admin Policies

Copy and paste the following SQL:

```sql
-- Migration: add_barcode_index_and_admin_policies
-- Add index on barcode for fast lookups (if not exists)
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);

-- Add admin policies for user management
-- Allow admins to update user profiles (role changes)
CREATE POLICY "Admins can update all user profiles"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to view all user profiles (enhanced policy)
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
CREATE POLICY "Admins can read all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to check if any users exist
CREATE OR REPLACE FUNCTION public.has_users()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM auth.users LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Click **RUN** to execute.

#### Migration 2: Create Default Admin User

Copy and paste the following SQL:

```sql
-- Migration: create_default_admin
-- This creates a default admin user with credentials admin/admin

DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Check if admin user already exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@inventory.local') THEN
    -- Generate UUID for admin user
    admin_user_id := gen_random_uuid();
    
    -- Insert into auth.users
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token,
      aud,
      role
    ) VALUES (
      admin_user_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@inventory.local',
      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- bcrypt hash of 'password'
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"System Administrator"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      '',
      'authenticated',
      'authenticated'
    );
    
    -- Insert into user_profiles
    INSERT INTO user_profiles (id, full_name, role, is_active)
    VALUES (admin_user_id, 'System Administrator', 'admin', true);
    
    RAISE NOTICE 'Default admin user created successfully';
  ELSE
    RAISE NOTICE 'Admin user already exists';
  END IF;
END $$;
```

Click **RUN** to execute.

### Step 2: Disable Email Confirmation

**Navigate to**: Supabase Dashboard > Authentication > Settings

1. Scroll to **Email Auth**
2. Find "Enable email confirmations"
3. **Uncheck** this option
4. Click **Save**

This allows users to login immediately without email verification.

### Step 3: Deploy Edge Function

**Option A: Using Supabase CLI**

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login:
```bash
supabase login
```

3. Link project:
```bash
supabase link --project-ref lnukcsvalpqqgtfgqtfa
```

4. Deploy function:
```bash
cd /workspace
supabase functions deploy user-management --project-ref lnukcsvalpqqgtfgqtfa
```

**Option B: Manual Deployment via Dashboard**

1. Navigate to: Supabase Dashboard > Edge Functions
2. Click "New Function"
3. Name: `user-management`
4. Copy the entire content from `/workspace/supabase/functions/user-management/index.ts`
5. Paste into the code editor
6. Click "Deploy"

**Edge Function Code** (if needed):

See file: `/workspace/supabase/functions/user-management/index.ts`

### Step 4: Set Service Role Key

**Navigate to**: Supabase Dashboard > Edge Functions > user-management > Settings

Add environment variable:
- **Key**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Get from Supabase Dashboard > Settings > API > service_role key (secret)

Click **Save**

### Step 5: Verify Deployment

1. **Test Admin Login**
   - Go to: https://zxud8w7y5opf.space.minimax.io
   - Email: `admin@inventory.local`
   - Password: `password`

2. **Test User Management**
   - Navigate to "User Management" (should appear in sidebar)
   - Try creating a test user
   - Try editing user roles

3. **Test Barcode Scanner**
   - Go to Products page
   - Click "Scan Barcode"
   - Try manual mode

### Verification Checklist

- [ ] Migration 1 applied successfully
- [ ] Migration 2 applied successfully
- [ ] Email confirmation disabled
- [ ] Edge function deployed
- [ ] Service role key configured
- [ ] Admin can login
- [ ] User Management accessible
- [ ] Can create new users
- [ ] Barcode scanner opens
- [ ] All existing features work

### Troubleshooting

**If admin login fails:**
```sql
-- Verify admin user exists
SELECT email, email_confirmed_at FROM auth.users WHERE email = 'admin@inventory.local';

-- Check user profile
SELECT * FROM user_profiles WHERE role = 'admin';
```

**If user management doesn't appear:**
- Verify you're logged in as admin
- Check browser console for errors
- Verify edge function is deployed

**If barcode scanner doesn't work:**
- Must use HTTPS (already enabled)
- Grant camera permissions
- Try manual mode if camera fails

### Support

For detailed documentation:
- Installation: `/workspace/inventory-system/INSTALLATION.md`
- Features: `/workspace/enhancement-summary.md`
- Status: `/workspace/implementation-status.md`

### Default Credentials

**Admin Account:**
- Email: `admin@inventory.local`
- Password: `password`
- **Action Required**: Change password after first login

### Post-Deployment

After completing all steps:
1. Login with admin credentials
2. Change admin password via User Management
3. Create additional user accounts as needed
4. Test barcode scanning functionality
5. Verify all features work correctly

---

**Deployment URL**: https://zxud8w7y5opf.space.minimax.io  
**Supabase Project**: lnukcsvalpqqgtfgqtfa  
**Status**: Frontend deployed, backend requires manual steps
