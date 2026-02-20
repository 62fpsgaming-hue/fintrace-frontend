# Supabase Configuration for Vercel Deployment

## Issue: Not redirecting to dashboard after login

This is likely caused by one of these issues:

### 1. Email Confirmation Required

By default, Supabase requires email confirmation. To disable this for testing:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `jgtarpigzpcadrsdmfhm`
3. Go to **Authentication** → **Providers** → **Email**
4. Scroll down to **Email Confirmation**
5. **Disable** "Confirm email" option
6. Save changes

### 2. Redirect URLs Not Configured

You need to add your Vercel deployment URL to allowed redirect URLs:

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add these URLs to **Redirect URLs**:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/dashboard`
   - `http://localhost:3000/auth/callback` (for local development)
   - `http://localhost:3000/dashboard` (for local development)

### 3. Site URL Configuration

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://your-app.vercel.app`

### 4. Vercel Environment Variables

Make sure these are set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL` = `https://jgtarpigzpcadrsdmfhm.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_bCRMFF6rrbHWCREJry4uMQ_rSAU4j0M`

## Testing

After making these changes:
1. Try creating a new account
2. If email confirmation is disabled, you should be able to login immediately
3. After login, you should be redirected to `/dashboard`

## Debugging

Check browser console for errors:
- Press F12 to open developer tools
- Go to Console tab
- Try logging in and check for any error messages
