# Vercel Environment Variables Setup

After deploying to Vercel, you need to configure these environment variables in your Vercel project settings:

## Required Environment Variables

Go to your Vercel project → Settings → Environment Variables and add:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: `https://jgtarpigzpcadrsdmfhm.supabase.co`
   - Environment: Production, Preview, Development

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: `sb_publishable_bCRMFF6rrbHWCREJry4uMQ_rSAU4j0M`
   - Environment: Production, Preview, Development

3. **NEXT_PUBLIC_API_URL** (if you have a backend)
   - Value: Your backend API URL
   - Environment: Production, Preview, Development

## After Adding Variables

1. Redeploy your application for the changes to take effect
2. You can trigger a redeploy from the Vercel dashboard or by pushing a new commit

## Testing

After redeployment:
1. Try logging in at `/auth/login`
2. After successful login, you should be redirected to `/dashboard`
3. The session should persist across page refreshes
