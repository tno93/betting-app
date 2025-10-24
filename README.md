# BetEdge - Sports Betting Odds Platform

A modern, professional sports betting odds comparison platform that helps users find arbitrage opportunities and positive EV bets across 150+ sportsbooks.

**Live App:** Coming soon!

![BetEdge](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Supabase](https://img.shields.io/badge/Supabase-Enabled-green) ![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)

## Features

- **Arbitrage Finder** - Identify risk-free betting opportunities
- **Positive EV Calculator** - Find long-term profitable bets
- **Real-Time Odds** - Live updates from 150+ sportsbooks
- **Smart Calculators** - Kelly Criterion, ROI, stake calculators
- **Performance Tracking** - Track your bets and analyze results
- **Multi-Sport Coverage** - NFL, NBA, MLB, NHL, Soccer, Tennis, MMA, and more

## Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **UI Components:** shadcn/ui
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Email/Password + Google OAuth)
- **Odds Data:** The Odds API
- **Payments:** Stripe
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Accounts on: GitHub, Vercel, Supabase, The Odds API

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/betedge-app.git
   cd betedge-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your API keys (see SETUP_GUIDE.md)

4. **Set up Supabase database:**
   - Run the SQL from `supabase/schema.sql` in your Supabase SQL Editor

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## Detailed Setup Instructions

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for complete step-by-step instructions, including:
- Creating all necessary accounts
- Configuring APIs and databases
- Deploying to production
- Troubleshooting common issues

## Project Structure

```
betedge-app/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication routes
│   ├── dashboard/           # Dashboard pages
│   ├── arbitrage/           # Arbitrage finder
│   ├── positive-ev/         # Positive EV finder
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── features/            # Feature-specific components
│   └── layout/              # Layout components
├── lib/                     # Utility functions
│   ├── supabase/           # Supabase client & helpers
│   ├── odds-api/           # The Odds API integration
│   └── stripe/             # Stripe integration
├── types/                   # TypeScript type definitions
├── supabase/               # Database schemas
└── public/                  # Static assets
```

## Environment Variables

Required environment variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# The Odds API
ODDS_API_KEY=
NEXT_PUBLIC_ODDS_API_BASE_URL=https://api.the-odds-api.com/v4

# Stripe (optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

## API Rate Limits

### The Odds API (Free Tier)
- 500 requests/month
- ~16 requests/day
- Use caching to minimize API calls

### Supabase (Free Tier)
- 500MB database
- 2GB bandwidth/month
- 50,000 monthly active users

## Subscription Tiers

### Free
- 5 opportunities per day
- Basic odds comparison
- Betting calculators
- 7-day historical data

### Premium ($49/month)
- Unlimited opportunities
- Real-time updates
- Instant alerts
- 90-day historical data
- Priority support

## Features Roadmap

- [x] Landing page
- [x] User authentication
- [x] Database schema
- [x] Odds API integration
- [x] Arbitrage calculation engine
- [x] Positive EV calculation engine
- [ ] Dashboard with live odds
- [ ] Arbitrage finder page
- [ ] Positive EV finder page
- [ ] Betting calculators
- [ ] Stripe subscription integration
- [ ] Email notifications
- [ ] Mobile app (future)

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

All rights reserved. This project is proprietary and not open for public use without permission.

## Support

For issues or questions:
1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Review Supabase logs
3. Check Vercel deployment logs
4. Verify environment variables

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [The Odds API](https://the-odds-api.com/)
- [Vercel](https://vercel.com/)

---

Built with ❤️ for smart sports bettors
