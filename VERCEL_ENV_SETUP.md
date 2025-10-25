# ✅ VERCEL ENVIRONMENT VARIABLES - COPY & PASTE

## 🟢 FOR FRONTEND PROJECT (fixeasy-frontend)

Go to: https://vercel.com/dashboard
→ Select: **fixeasy-frontend**
→ Click: **Settings** → **Environment Variables**

### Add these 7 variables (Check ALL 3 boxes: Production, Preview, Development)

---

**Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://wphmhlrttmzsmngysfws.supabase.co
```
☑️ Production ☑️ Preview ☑️ Development

---

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaG1obHJ0dG16c21uZ3lzZndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMDA3NjUsImV4cCI6MjA3NTg3Njc2NX0.LL6ezLtkHCeRBu3USlnxtr5QMEFBwOa05qH_RIpLaxA
```
☑️ Production ☑️ Preview ☑️ Development

---

**Variable 3:**
```
Name: NEXT_PUBLIC_SUPABASE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaG1obHJ0dG16c21uZ3lzZndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMDA3NjUsImV4cCI6MjA3NTg3Njc2NX0.LL6ezLtkHCeRBu3USlnxtr5QMEFBwOa05qH_RIpLaxA
```
☑️ Production ☑️ Preview ☑️ Development

---

**Variable 4:**
```
Name: NEXT_PUBLIC_API_URL
Value: https://api.fixeasy.irish
```
☑️ Production ☑️ Preview ☑️ Development

---

**Variable 5:**
```
Name: NEXT_PUBLIC_SITE_URL
Value: https://fixeasy.irish
```
☑️ Production ☑️ Preview ☑️ Development

---

**Variable 6:**
```
Name: NEXT_PUBLIC_ENV
Value: production
```
☑️ Production only (leave Preview & Development unchecked)

---

**Variable 7:**
```
Name: NODE_VERSION
Value: 18
```
☑️ Production ☑️ Preview ☑️ Development

---

## 🔵 FOR BACKEND PROJECT (fixeasy-backend) - IF YOU HAVE ONE

Go to: https://vercel.com/dashboard
→ Select: **fixeasy-backend** (different project!)
→ Click: **Settings** → **Environment Variables**

### Python dependencies

Deployments that target the backend project should install the Python packages listed in
`backend/Backend--main/requirements.txt`:

```bash
python3 -m pip install -r backend/Backend--main/requirements.txt
```

If the build environment does not provide a `pip` shim, the `python3 -m pip` form works
consistently across Vercel and local setups.

---

**Variable 1:**
```
Name: SUPABASE_URL
Value: https://wphmhlrttmzsmngysfws.supabase.co
```
☑️ Production ☑️ Preview ☑️ Development

---

**Variable 2:**
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: nXtEMR5cpNwK8IijCSivNY/2gWA+7hCkL1dAyIx6eFjJ3Fy3fRCm3XWh2ekYyraNe/lLYbafxN0jb4PFazXAUw==
```
☑️ Production ☑️ Preview ☑️ Development
⚠️ **KEEP SECRET - Backend only!**

---

**Variable 3:**
```
Name: SUPABASE_JWT_SECRET
Value: nXtEMR5cpNwK8IijCSivNY/2gWA+7hCkL1dAyIx6eFjJ3Fy3fRCm3XWh2ekYyraNe/lLYbafxN0jb4PFazXAUw==
```
☑️ Production ☑️ Preview ☑️ Development
⚠️ **KEEP SECRET - Backend only!**

---

**Variable 4:**
```
Name: CORS_ALLOWED_ORIGINS
Value: https://fixeasy.irish,https://www.fixeasy.irish
```
☑️ Production ☑️ Preview ☑️ Development

---

**Variable 5:**
```
Name: ENVIRONMENT
Value: production
```
☑️ Production only

---

**Variable 6:**
```
Name: PYTHON_VERSION
Value: 3.11
```
☑️ Production ☑️ Preview ☑️ Development

---

## ✅ AFTER ADDING ALL VARIABLES

1. **Verify they're all saved** - refresh the page and check they're listed
2. **Redeploy:**
   - Go to **Deployments** tab
   - Click "..." on the latest deployment
   - Click **Redeploy**
3. **Wait for build** - takes 1-2 minutes
4. **Test the site** - visit https://fixeasy.irish

---

## 🔒 SECURITY REMINDER

✅ **Safe to expose (Frontend):**
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY (designed for public use)
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_SITE_URL

⚠️ **NEVER expose publicly (Backend only):**
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_JWT_SECRET

❌ **DO NOT:**
- Commit these keys to Git
- Share service_role key publicly
- Add backend keys to frontend project

✅ **Already protected:**
- `.env.local` is in `.gitignore`
- These instructions won't be committed
- Vercel keeps env vars secret

---

## 📋 Quick Checklist

**Frontend (fixeasy-frontend):**
- [ ] Add 7 environment variables in Vercel
- [ ] Check boxes for all environments
- [ ] Click Save after each one
- [ ] Redeploy the project
- [ ] Test: https://fixeasy.irish

**Local Development:**
- [x] `.env.local` already updated ✅
- [ ] Run: `npm run dev`
- [ ] Test: http://localhost:3000
- [ ] Check browser console for errors

**Backend (if you have it):**
- [ ] Add 6 environment variables in Vercel
- [ ] Use service_role key (not anon key!)
- [ ] Redeploy backend project
- [ ] Test: https://api.fixeasy.irish/health

---

**Status:** Keys ready to copy and paste! 🚀
**Next Step:** Go to Vercel and add these variables
**Time needed:** ~5 minutes
