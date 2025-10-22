# FixEasy Environment Variables Guide

## 🔑 WHERE TO GET YOUR KEYS

### 1. Supabase Keys (Get from Supabase Dashboard)

**Go to:** https://supabase.com/dashboard/project/wphmhlrttmzsmngysfws/settings/api

You'll see:

```
Project URL: https://wphmhlrttmzsmngysfws.supabase.co
```

**Copy these keys:**

1. **`anon` key (public)** - This is safe to use in frontend
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaG1obHJ0dG16c21uZ3lzZndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYxMjM0NTYsImV4cCI6MjAwMTY5OTQ1Nn0.example-signature`
   - Use this for: NEXT_PUBLIC_SUPABASE_ANON_KEY

2. **`service_role` key** - KEEP SECRET! Only for backend
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaG1obHJ0dG16c21uZ3lzZndzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NjEyMzQ1NiwiZXhwIjoyMDAxNjk5NDU2fQ.example-signature`
   - Use this ONLY in backend (api.fixeasy.irish)

3. **JWT Secret** - For token verification
   - Found on same page under "JWT Settings"
   - Use this in backend for verifying tokens

---

## 📝 STEP BY STEP: Add to Vercel

### For Frontend (fixeasy-frontend)

**Step 1:** Go to Vercel Dashboard
- URL: https://vercel.com/dashboard
- Or: https://vercel.com/team_9nvrDzYa6wKG4rh0ypvqYAEZ/fixeasy-frontend

**Step 2:** Click on your project → **Settings** → **Environment Variables**

**Step 3:** Add these variables one by one:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://wphmhlrttmzsmngysfws.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `<your anon key from Supabase>` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_KEY` | `<same anon key>` | Production, Preview, Development |
| `NEXT_PUBLIC_API_URL` | `https://api.fixeasy.irish` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://fixeasy.irish` | Production, Preview, Development |
| `NEXT_PUBLIC_ENV` | `production` | Production only |
| `NODE_VERSION` | `18` | Production, Preview, Development |

**Important:** Check all three boxes (Production, Preview, Development) for each variable!

**Step 4:** Click **Save** after adding each variable

**Step 5:** Go to **Deployments** tab → Click "..." on latest deployment → **Redeploy**

---

## 🖥️ For Local Development (.env.local)

I already created `.env.local` file for you. Just update it:

**Edit this file:** `c:\Users\DELL\Desktop\fixeasy-frontend\.env.local`

**Replace `YOUR_SUPABASE_ANON_KEY_HERE` with your actual key:**

```env
# FixEasy Frontend Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://wphmhlrttmzsmngysfws.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_KEY_HERE
NEXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_KEY_HERE

# API Configuration
NEXT_PUBLIC_API_URL=https://api.fixeasy.irish
NEXT_PUBLIC_SITE_URL=https://fixeasy.irish

# Environment
NEXT_PUBLIC_ENV=development
NODE_VERSION=18
```

---

## 🔒 For Backend (fixeasy-backend) - Separate Project

If you have a backend project on Vercel, add these:

| Variable Name | Value | Keep Secret? |
|---------------|-------|--------------|
| `SUPABASE_URL` | `https://wphmhlrttmzsmngysfws.supabase.co` | No |
| `SUPABASE_SERVICE_ROLE_KEY` | `<service_role key from Supabase>` | ⚠️ YES! |
| `SUPABASE_JWT_SECRET` | `<JWT secret from Supabase>` | ⚠️ YES! |
| `CORS_ALLOWED_ORIGINS` | `https://fixeasy.irish,https://www.fixeasy.irish` | No |
| `ENVIRONMENT` | `production` | No |
| `PYTHON_VERSION` | `3.11` | No |

---

## ✅ How to Verify It's Working

### After adding variables to Vercel:

1. **Trigger new deployment:**
   ```bash
   git commit --allow-empty -m "Test environment variables"
   git push origin main
   ```

2. **Check deployment logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on latest deployment
   - Check "Build Logs" - should see no errors about missing env vars

3. **Test the site:**
   - Visit: https://fixeasy.irish
   - Open browser console (F12)
   - Type: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
   - Should show: `https://wphmhlrttmzsmngysfws.supabase.co`

### For local development:

```bash
# Run dev server
npm run dev

# Open browser at http://localhost:3000
# Open console (F12)
# Should work without errors
```

---

## 🚨 SECURITY WARNING

### ✅ SAFE to expose (NEXT_PUBLIC_*):
- `NEXT_PUBLIC_SUPABASE_URL` 
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (designed for frontend)
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SITE_URL`

### ⛔ NEVER expose publicly:
- `SUPABASE_SERVICE_ROLE_KEY` (backend only!)
- `SUPABASE_JWT_SECRET` (backend only!)
- Any key without `NEXT_PUBLIC_` prefix

### Why `anon` key is safe:
- Limited permissions
- Works with Row-Level Security (RLS)
- Users can only access data they own
- Supabase designed it for client-side use

---

## 📸 Visual Guide - Where to Find Keys

**1. Go to Supabase Dashboard:**
```
https://supabase.com/dashboard/project/wphmhlrttmzsmngysfws
```

**2. Click "Settings" (gear icon) → "API"**

**3. You'll see:**
```
┌─────────────────────────────────────────┐
│ Project URL                             │
│ https://wphmhlrttmzsmngysfws.supabase.co│
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ API Keys                                │
├─────────────────────────────────────────┤
│ anon / public                           │
│ eyJhbGci... [COPY THIS]                 │
├─────────────────────────────────────────┤
│ service_role                            │
│ eyJhbGci... [COPY THIS - Backend only]  │
└─────────────────────────────────────────┘
```

**4. Copy the `anon` key → Paste in Vercel**

---

## 🎯 Quick Checklist

- [ ] Get `anon` key from Supabase dashboard
- [ ] Add to Vercel as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Add same key as `NEXT_PUBLIC_SUPABASE_KEY` (compatibility)
- [ ] Add all 7 environment variables to Vercel
- [ ] Check all 3 environments (Production, Preview, Development)
- [ ] Save each variable
- [ ] Redeploy from Vercel dashboard
- [ ] Update local `.env.local` file
- [ ] Test: `npm run dev` should work without errors
- [ ] Test: https://fixeasy.irish should load without console errors

---

**Need Help?**
- Supabase Docs: https://supabase.com/docs/guides/api
- Vercel Env Vars: https://vercel.com/docs/environment-variables
- Next.js Env Vars: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
