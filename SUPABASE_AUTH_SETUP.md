# Supabase Authentication Setup Guide

## Steps to Complete in Supabase Dashboard

### 1. Enable Email Authentication
1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **Authentication** → **Providers**
3. Find **Email** provider and ensure it's **enabled**
4. (Optional) Disable "Confirm email" if you want users to log in immediately without email verification
   - Under **Authentication** → **Settings** → **Auth Providers** → **Email**
   - Toggle off "Enable email confirmations" (for development)

### 2. Configure Email Templates (Optional for Development)
1. Go to **Authentication** → **Email Templates**
2. You can customize the confirmation, invite, and reset password email templates
3. For development, you can skip this step

### 3. Set Up Site URL
1. Go to **Authentication** → **URL Configuration**
2. Add your local development URL: `http://localhost:3001`
3. Add any production URLs when you deploy

### 4. Run the SQL Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy and paste the contents of `supabase-auth-schema.sql` (created in next step)
4. Click **Run** to execute the SQL

### 5. Verify RLS Policies
1. Go to **Authentication** → **Policies**
2. Ensure the policies are created for both `profiles` and `events` tables
3. You should see policies that allow users to:
   - Read all profiles
   - Update their own profile
   - Read all events
   - Create events when authenticated
   - Update/delete their own events

## That's it!
Once you've completed these steps, your authentication system will be ready to use.
