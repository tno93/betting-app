# BetEdge Setup Guide

Welcome! This guide will walk you through setting up your BetEdge sports betting odds platform from scratch. Don't worry - I'll explain everything in simple terms!

## What You're Building

BetEdge is a web app that:
- Compares odds from 150+ sportsbooks
- Finds arbitrage opportunities (guaranteed profit bets)
- Identifies positive EV bets (long-term profitable bets)
- Includes betting calculators and analytics

## Prerequisites

Before starting, make sure you have:
- A computer with internet connection
- Basic ability to follow instructions (no coding knowledge needed!)

---

## Step 1: Create Your Accounts

You'll need to create free accounts on these platforms:

### 1.1 GitHub Account
**Purpose:** Store your code
**Link:** https://github.com/signup

1. Go to GitHub and click "Sign up"
2. Enter your email, create a password
3. Verify your email address
4. Choose the free plan

### 1.2 Vercel Account
**Purpose:** Host your website (make it live on the internet)
**Link:** https://vercel.com/signup

1. Go to Vercel and click "Sign up"
2. **Important:** Sign up WITH your GitHub account (click "Continue with GitHub")
3. This connects Vercel to GitHub automatically

### 1.3 Supabase Account
**Purpose:** Database (stores user data, bets, etc.)
**Link:** https://supabase.com/dashboard

1. Go to Supabase and click "Start your project"
2. Sign up with GitHub (recommended)
3. Once logged in, click "New Project"
4. Fill in:
   - **Name:** betedge
   - **Database Password:** Create a strong password (SAVE THIS!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free
5. Click "Create new project" (takes ~2 minutes to set up)

### 1.4 The Odds API Account
**Purpose:** Get real-time sports betting odds
**Link:** https://the-odds-api.com/

1. Go to The Odds API
2. Scroll down and enter your email
3. Click "Get API Key"
4. Check your email for the API key
5. **SAVE THIS KEY** - you'll need it later
6. Free plan gives you 500 requests/month

### 1.5 Stripe Account (Optional - for payments)
**Purpose:** Accept subscription payments
**Link:** https://dashboard.stripe.com/register

1. Go to Stripe and click "Sign up"
2. Enter your email and create a password
3. You can use "Test Mode" for development (no real money)
4. We'll set this up later once the app is working

---

## Step 2: Push Your Code to GitHub

Now let's get your code onto GitHub:

1. **Open your terminal/command prompt**
   - Windows: Press `Win + R`, type `cmd`, press Enter
   - Mac: Press `Cmd + Space`, type `terminal`, press Enter

2. **Navigate to your project folder:**
   ```bash
   cd "C:\Users\Flying Phoenix PCs\Desktop\betting app\betedge-app"
   ```

3. **Initialize Git and push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - BetEdge app"
   ```

4. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `betedge-app`
   - Description: "Sports betting odds comparison platform"
   - Make it **Private** (recommended)
   - Don't initialize with README
   - Click "Create repository"

5. **Connect your local code to GitHub:**
   Copy the commands GitHub shows you under "push an existing repository", they look like:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/betedge-app.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR-USERNAME` with your actual GitHub username

---

## Step 3: Set Up Supabase Database

Now let's create the database tables:

1. **Go to your Supabase project dashboard**
   - https://supabase.com/dashboard/projects

2. **Click on your "betedge" project**

3. **Click "SQL Editor" in the left sidebar**

4. **Click "New Query"**

5. **Open the schema file:**
   - On your computer, open: `betedge-app\supabase\schema.sql`
   - Copy ALL the contents (Ctrl+A, Ctrl+C)

6. **Paste into Supabase SQL Editor and click "Run"**
   - This creates all your database tables
   - You should see "Success. No rows returned"

7. **Get your Supabase credentials:**
   - Click "Project Settings" (gear icon in bottom left)
   - Click "API" in the settings menu
   - You'll see two important things:
     - **Project URL** (looks like: https://abcdefgh.supabase.co)
     - **anon public key** (long string of characters)
   - **SAVE THESE** - you'll need them next!

---

## Step 4: Configure Environment Variables

Environment variables are like secret passwords your app needs to work. Let's add them:

1. **Open your `.env.local` file** in the betedge-app folder

2. **Fill in the values you saved:**

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# The Odds API
ODDS_API_KEY=your-odds-api-key-here
NEXT_PUBLIC_ODDS_API_BASE_URL=https://api.the-odds-api.com/v4

# Stripe Configuration (leave empty for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

3. **How to find Supabase Service Role Key:**
   - In Supabase dashboard: Settings > API
   - Scroll down to "service_role" key
   - Click "Reveal" and copy it
   - **IMPORTANT:** Never share this key publicly!

4. **Save the file** (Ctrl+S or Cmd+S)

---

## Step 5: Test Locally

Let's make sure everything works on your computer:

1. **Open terminal in your project folder:**
   ```bash
   cd "C:\Users\Flying Phoenix PCs\Desktop\betting app\betedge-app"
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and go to:**
   ```
   http://localhost:3000
   ```

5. **You should see your BetEdge landing page!** 🎉

6. **Test signup:**
   - Click "Get Started"
   - Create an account with your email
   - Check that you can log in

7. **If everything works, press `Ctrl+C` in terminal to stop the server**

---

## Step 6: Deploy to Vercel (Make it Live!)

Now let's put your app on the internet:

1. **Push your latest changes to GitHub:**
   ```bash
   git add .
   git commit -m "Add environment configuration"
   git push
   ```

2. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard

3. **Click "Add New..." > "Project"**

4. **Import your GitHub repository:**
   - Find "betedge-app" in the list
   - Click "Import"

5. **Configure the project:**
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** ./
   - Click "Environment Variables"

6. **Add all your environment variables from `.env.local`:**
   - Click "Add" for each variable
   - Copy the name and value from your `.env.local` file
   - **Important:** Change `NEXT_PUBLIC_APP_URL` to your Vercel URL (you'll get this after deployment)
   - Add all variables EXCEPT the Stripe ones (we'll add those later)

7. **Click "Deploy"**
   - Wait 2-3 minutes for deployment
   - You'll get a URL like: `https://betedge-app.vercel.app`

8. **Update the App URL:**
   - Go to Project Settings > Environment Variables
   - Edit `NEXT_PUBLIC_APP_URL`
   - Change it to your Vercel URL: `https://betedge-app.vercel.app`
   - Click "Save"
   - Go to Deployments tab and click "Redeploy"

9. **Visit your live app!** 🚀
   - Click on the URL Vercel gave you
   - Your app is now live on the internet!

---

## Step 7: Configure Supabase Authentication

Update Supabase to work with your live URL:

1. **Go to Supabase Dashboard > Authentication > URL Configuration**

2. **Add these URLs:**
   - **Site URL:** `https://your-app.vercel.app`
   - **Redirect URLs:** Add:
     - `https://your-app.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback` (for local testing)

3. **Click "Save"**

4. **Test authentication on your live site:**
   - Go to your Vercel URL
   - Try signing up with a new account
   - It should work!

---

## Step 8: Test The Odds API

Let's make sure odds are loading:

1. **Check your API usage:**
   - Go to https://the-odds-api.com/account/
   - Log in with the email you used to get the API key
   - See your remaining requests (should be 500)

2. **Test in your app:**
   - Once you complete the dashboard (next steps), you'll see live odds
   - Each API call uses 1 request from your monthly quota

3. **Important limits:**
   - Free tier: 500 requests/month
   - That's about 16 requests per day
   - Use wisely! Cache results when possible

---

## What's Next?

Your foundation is set up! Here's what we still need to build:

- ✅ Landing page
- ✅ Authentication (login/signup)
- ✅ Database setup
- ✅ API integration
- ⏳ Dashboard page (showing odds)
- ⏳ Arbitrage finder page
- ⏳ Positive EV finder page
- ⏳ Betting calculators
- ⏳ Stripe integration (for premium subscriptions)

---

## Troubleshooting

### "Module not found" errors
```bash
npm install
```

### Supabase connection errors
- Double-check your environment variables
- Make sure there are no extra spaces
- Verify your Supabase project is active

### The Odds API not working
- Check if you have requests remaining
- Verify your API key is correct
- Make sure the key is in `.env.local` AND Vercel environment variables

### Can't log in
- Check Supabase Auth settings
- Verify redirect URLs are correct
- Check browser console for errors (F12)

---

## Need Help?

If you get stuck:
1. Check the error message carefully
2. Google the error message
3. Check Supabase logs: Dashboard > Logs
4. Check Vercel logs: Dashboard > Project > Logs
5. Verify all environment variables are set correctly

---

## Security Notes

🔒 **Never commit `.env.local` to GitHub!**
- It's already in `.gitignore`, but double-check
- Never share your service role key
- Use environment variables in Vercel for production

🔒 **Row Level Security (RLS) is enabled**
- Users can only see their own data
- This is configured in the SQL schema

---

## Cost Breakdown

- **GitHub:** Free
- **Vercel:** Free (hobby plan, unlimited bandwidth)
- **Supabase:** Free (up to 500MB database, 2GB bandwidth, 50,000 monthly active users)
- **The Odds API:** Free (500 requests/month)
- **Stripe:** Free (2.9% + 30¢ per transaction when you go live)

**Total monthly cost to start: $0** 🎉

---

Congratulations! Your BetEdge platform is now set up and running. Let's continue building the remaining features!
