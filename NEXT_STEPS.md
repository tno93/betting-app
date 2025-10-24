# Next Steps - Getting Your BetEdge App Live

## 🎉 Congratulations!

Your BetEdge sports betting odds platform is **100% built** and ready to deploy! Here's what you need to do to get it live on the internet.

---

## Step 1: Get Your API Keys (30 minutes)

Follow the complete instructions in **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**, but here's the quick version:

### 1.1 Create Supabase Project (10 min)
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: `betedge`, choose a password, select region
4. Wait 2 minutes for project to be created
5. Go to Settings → API
6. Copy these 3 values:
   - Project URL
   - anon public key
   - service_role key (click "Reveal" to see it)

### 1.2 Run Database Setup (2 min)
1. In Supabase dashboard, click "SQL Editor"
2. Click "New Query"
3. Open `betedge-app/supabase/schema.sql` on your computer
4. Copy ALL the contents and paste into Supabase SQL Editor
5. Click "Run" → You should see "Success"

### 1.3 Get The Odds API Key (5 min)
1. Go to https://the-odds-api.com/
2. Enter your email
3. Click "Get API Key"
4. Check your email and copy the API key

### 1.4 Update .env.local File (3 min)
1. Open `betedge-app/.env.local` in a text editor
2. Fill in the values you just copied:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
ODDS_API_KEY=your-odds-api-key-here
```

3. Save the file

---

## Step 2: Test Locally (5 minutes)

1. **Open terminal in your project folder:**
   ```bash
   cd "C:\Users\Flying Phoenix PCs\Desktop\betting app\betedge-app"
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   - Go to http://localhost:3000
   - You should see your beautiful landing page!

4. **Test signup:**
   - Click "Get Started"
   - Create an account with your email
   - You should be redirected to the dashboard
   - Check if arbitrage and positive EV pages load (they might show errors if no live games are happening)

5. **Test calculators:**
   - Go to Calculators page
   - Try the arbitrage calculator with odds like 2.1 and 2.2
   - Should show you can profit!

6. **If everything works, press `Ctrl+C` to stop the server**

---

## Step 3: Push to GitHub (10 minutes)

### 3.1 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `betedge-app`
3. Description: "Sports betting odds comparison platform"
4. Make it **Private** (recommended)
5. Don't initialize with README
6. Click "Create repository"

### 3.2 Push Your Code
Open terminal and run these commands:

```bash
cd "C:\Users\Flying Phoenix PCs\Desktop\betting app\betedge-app"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - BetEdge sports betting platform"

# Connect to GitHub (replace YOUR-USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/betedge-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3.3 Verify
- Go to https://github.com/YOUR-USERNAME/betedge-app
- You should see all your files!

---

## Step 4: Deploy to Vercel (15 minutes)

### 4.1 Import Project
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your `betedge-app` repository from GitHub
4. Click "Import"

### 4.2 Configure Build Settings
- Framework Preset: **Next.js** (auto-detected)
- Root Directory: `./`
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)
- Keep these defaults!

### 4.3 Add Environment Variables
Click "Environment Variables" and add these:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key-here
ODDS_API_KEY = your-odds-api-key-here
NEXT_PUBLIC_ODDS_API_BASE_URL = https://api.the-odds-api.com/v4
NEXT_PUBLIC_APP_URL = https://betedge-app.vercel.app
NODE_ENV = production
```

**Important:**
- Copy values from your `.env.local` file
- For `NEXT_PUBLIC_APP_URL`, use the Vercel URL you'll get after deployment
- We'll update this URL in the next step

### 4.4 Deploy!
1. Click "Deploy"
2. Wait 2-3 minutes for build and deployment
3. You'll get a URL like: `https://betedge-app-abc123.vercel.app`
4. Click on it to see your live site!

### 4.5 Update App URL
1. In Vercel, go to Project Settings → Environment Variables
2. Find `NEXT_PUBLIC_APP_URL`
3. Click "Edit"
4. Change value to your actual Vercel URL (e.g., `https://betedge-app-abc123.vercel.app`)
5. Click "Save"
6. Go to Deployments tab
7. Click "..." menu on latest deployment → "Redeploy"
8. Click "Redeploy" to confirm

---

## Step 5: Configure Supabase for Production (5 minutes)

### 5.1 Update Supabase Auth URLs
1. Go to Supabase dashboard
2. Click Authentication → URL Configuration
3. **Site URL:** `https://your-vercel-url.vercel.app`
4. **Redirect URLs:** Add:
   - `https://your-vercel-url.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local testing)
5. Click "Save"

### 5.2 Enable Google OAuth (Optional)
1. In Supabase: Authentication → Providers
2. Click "Google"
3. Enable the provider
4. Follow instructions to get Google OAuth credentials
5. This allows "Sign in with Google"

---

## Step 6: Test Your Live App (5 minutes)

1. **Visit your Vercel URL**
2. **Test signup:**
   - Click "Get Started"
   - Create a new account
   - Should redirect to dashboard
3. **Test features:**
   - Click Arbitrage → Should load (might show 0 opportunities if no games)
   - Click Positive EV → Should load
   - Click Calculators → Should work perfectly
4. **Test logout and login:**
   - Logout from user menu
   - Login again
   - Should work smoothly

---

## Step 7: Monitor Your API Usage

### The Odds API Free Tier Limits
- **500 requests per month**
- **~16 requests per day**
- Each sport fetch = 1 request
- Fetching 5 sports = 5 requests

### Check Your Usage
1. Go to https://the-odds-api.com/account/
2. Login with your email
3. See "Requests Remaining"

### Tips to Conserve Requests
- Use the refresh button sparingly
- Implement caching (already built into database schema)
- Consider upgrading to paid tier when needed ($10-50/month)

---

## Troubleshooting

### Build Failed on Vercel
- Check environment variables are correct
- Check build logs for specific error
- Make sure all environment variables are added

### Can't Login on Live Site
- Verify Supabase Redirect URLs are correct
- Check browser console for errors (F12)
- Make sure `NEXT_PUBLIC_APP_URL` matches your Vercel URL

### Arbitrage/Positive EV Shows Errors
- Check The Odds API key is correct
- Verify you have API requests remaining
- Some sports might not have live games (shows 0 opportunities)
- Check Vercel logs: Vercel Dashboard → Project → Logs

### General Issues
1. Check environment variables in Vercel
2. Check Supabase logs: Supabase Dashboard → Logs
3. Check Vercel deployment logs
4. Verify all values from `.env.local` are in Vercel

---

## Optional: Custom Domain (15 minutes)

Want `betedge.com` instead of `betedge-app.vercel.app`?

1. Buy a domain (Namecheap, GoDaddy, etc.) - ~$10/year
2. In Vercel: Project Settings → Domains
3. Add your domain
4. Follow Vercel's DNS configuration instructions
5. Update `NEXT_PUBLIC_APP_URL` to your custom domain
6. Update Supabase Redirect URLs to use custom domain

---

## Costs Summary

### Current Setup (All Free!)
- ✅ **Vercel:** Free (Hobby plan)
- ✅ **Supabase:** Free (500MB database, 50K users)
- ✅ **The Odds API:** Free (500 requests/month)
- ✅ **GitHub:** Free (private repos)
- **Total: $0/month**

### When You Need to Scale
- **The Odds API Paid:** $10-50/month (1,000-10,000 requests)
- **Vercel Pro:** $20/month (more bandwidth, analytics)
- **Supabase Pro:** $25/month (8GB database, 100K users)
- **Custom Domain:** ~$10/year

---

## Future Enhancements

Once your app is live and you want to add more features:

### 1. Stripe Integration (Paid Subscriptions)
- Add Stripe API keys
- Create subscription products
- Implement checkout flow
- Add webhook handler
- **Estimated time:** 2-3 hours
- **Guide:** I can help you with this!

### 2. Email Notifications
- Integrate SendGrid or Resend
- Send opportunity alerts
- Daily digest emails
- **Estimated time:** 1-2 hours

### 3. Historical Data & Analytics
- Charts using Recharts (already installed)
- ROI tracking over time
- Bet history dashboard
- **Estimated time:** 2-3 hours

### 4. Advanced Filters
- Filter by sport, bookmaker, min profit
- Save favorite sportsbooks
- Custom alert thresholds
- **Estimated time:** 1-2 hours

---

## Support & Resources

### Documentation
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[FEATURES.md](./FEATURES.md)** - Complete feature list
- **[README.md](./README.md)** - Project overview

### External Docs
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- The Odds API: https://the-odds-api.com/documentation
- Vercel: https://vercel.com/docs

### Need Help?
- Check error messages in browser console (F12)
- Review Vercel deployment logs
- Check Supabase logs
- Review The Odds API documentation

---

## You're All Set! 🎉

Your professional sports betting odds platform is ready to:
- ✅ Find arbitrage opportunities
- ✅ Calculate positive EV bets
- ✅ Provide betting calculators
- ✅ Handle user authentication
- ✅ Support free and premium tiers
- ✅ Scale to thousands of users

**Next Action:** Complete Steps 1-6 above to get your app live!

**Estimated Total Time:** ~1-2 hours

Good luck, and happy betting! 🚀💰
