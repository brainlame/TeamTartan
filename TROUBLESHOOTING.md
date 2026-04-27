# Troubleshooting Guide

## Current Status

✅ **Fixed:**
- Dropdown arrow overlap in sort dropdown
- API key is now correct
- Dev server is running

⚠️ **Issues:**
1. Events loading forever
2. Login not working

---

## Quick Diagnosis

### The events are NOT loading because you're not logged in

**Answer:** Events SHOULD load without login - there's likely a **Row Level Security (RLS) policy** blocking access.

---

## How to Fix

### Step 1: Run the Complete Setup SQL

1. Open this link: https://app.supabase.com/project/pqbwoypiibednfzibtkp/sql
2. Click "New Query"
3. Copy ALL the SQL from `complete-setup.sql` file
4. Paste it into the SQL editor
5. Click "Run"

This will:
- Create/update the events table
- Add the `max_participants` column
- Fix RLS policies to allow public read access
- Set up proper authentication policies

### Step 2: Check Your Browser Console

1. Open your app: http://localhost:3000
2. Press F12 to open DevTools
3. Go to the **Console** tab
4. Look for errors - you should now see an error message explaining what's wrong

Common errors you might see:

#### Error: "new row violates row-level security policy"
**Fix:** Run the `complete-setup.sql` script above

#### Error: "permission denied for table events"
**Fix:** RLS policies are too restrictive. The SQL script above fixes this.

#### Error: "relation 'events' does not exist"
**Fix:** The events table hasn't been created. Run `supabase-schema.sql` OR `complete-setup.sql`

### Step 3: Test the Connection

Open `test-supabase-connection.html` in your browser:
1. Replace `YOUR_ANON_KEY_HERE` with your anon key (already in your .env)
2. Open the file in Chrome/Firefox
3. It will tell you if the connection works

---

## Why Login Might Not Work

### Check Auth Settings

1. Go to https://app.supabase.com/project/pqbwoypiibednfzibtkp/auth/users
2. Make sure authentication is enabled
3. Check if you have any test users

### Check Email Confirmation

By default, Supabase requires email confirmation. To disable for testing:

1. Go to https://app.supabase.com/project/pqbwoypiibednfzibtkp/auth/settings
2. Scroll to "User Signups"
3. Toggle off "Enable email confirmations" (for development only!)

### Check Auth Redirect URLs

1. Go to https://app.supabase.com/project/pqbwoypiibednfzibtkp/auth/url-configuration
2. Add these to "Redirect URLs":
   - `http://localhost:3000`
   - `http://localhost:3000/login`
   - `http://localhost:3000/signup`

---

## Expected Behavior After Fix

After running `complete-setup.sql`:

✅ Events should load immediately (even without login)
✅ You can browse events without logging in
✅ Login/signup should work
✅ You can only create/edit/delete events when logged in

---

## Still Not Working?

### Check Supabase Project Status

1. Go to https://app.supabase.com/projects
2. Make sure your project is not paused
3. Check if there's a red/yellow status indicator

### Enable Detailed Logging

The app now has detailed error logging. Check your browser console (F12) for:
- Connection errors
- RLS policy errors
- Authentication errors

### Test Individual Components

#### Test 1: Can Supabase connect?
```javascript
// Run in browser console (F12)
const { createClient } = supabase
const client = createClient(
  'https://pqbwoypiibednfzibtkp.supabase.co',
  'YOUR_ANON_KEY_HERE'
)
client.from('events').select('count').then(console.log)
```

#### Test 2: Check RLS policies
```sql
-- Run in Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'events';
```

You should see at least one policy with `cmd = 'SELECT'` and `using = 'true'`

---

## Next Steps

1. **Run `complete-setup.sql` in Supabase SQL Editor** ← DO THIS FIRST
2. Refresh your browser at http://localhost:3000
3. Open browser console (F12) to see detailed error messages
4. If still not working, send me a screenshot of the console errors
