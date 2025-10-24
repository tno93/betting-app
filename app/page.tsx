import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Calculator, Zap, Shield, BarChart3, Bell } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
            <span className="text-xl font-bold">BetEdge</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm hover:text-blue-600 transition">
              Features
            </Link>
            <Link href="#pricing" className="text-sm hover:text-blue-600 transition">
              Pricing
            </Link>
            <Link href="#how-it-works" className="text-sm hover:text-blue-600 transition">
              How It Works
            </Link>
          </nav>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4" variant="secondary">
          Smarter Sports Betting
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Find Profitable Bets,
          <br />
          Guaranteed.
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
          BetEdge analyzes millions of odds across all major sportsbooks to find arbitrage opportunities and
          positive EV bets that give you a mathematical edge.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/auth/signup">
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#how-it-works">Learn More</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
          <div>
            <div className="text-3xl font-bold">150+</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Sportsbooks</div>
          </div>
          <div>
            <div className="text-3xl font-bold">15+</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Sports Covered</div>
          </div>
          <div>
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Real-Time Data</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need to Win</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Professional-grade tools to find and capitalize on betting opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 mb-2 text-blue-600" />
              <CardTitle>Arbitrage Finder</CardTitle>
              <CardDescription>
                Bet both sides and guarantee profit. Our algorithm finds risk-free opportunities across
                sportsbooks.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 mb-2 text-purple-600" />
              <CardTitle>Positive EV Bets</CardTitle>
              <CardDescription>
                Identify mispriced odds where the probability is in your favor for long-term profitability.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Calculator className="h-10 w-10 mb-2 text-green-600" />
              <CardTitle>Smart Calculators</CardTitle>
              <CardDescription>
                Calculate stakes, profits, Kelly Criterion, and ROI with our suite of betting tools.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 mb-2 text-orange-600" />
              <CardTitle>Real-Time Odds</CardTitle>
              <CardDescription>
                Get instant updates from 150+ sportsbooks so you never miss a profitable opportunity.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 mb-2 text-pink-600" />
              <CardTitle>Performance Tracking</CardTitle>
              <CardDescription>
                Track your bets, analyze your ROI, and optimize your strategy with detailed analytics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Bell className="h-10 w-10 mb-2 text-red-600" />
              <CardTitle>Instant Alerts</CardTitle>
              <CardDescription>
                Get notified immediately when new opportunities match your preferences.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20 bg-zinc-100 dark:bg-zinc-900 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-zinc-600 dark:text-zinc-400">Get started in minutes</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Create your free account in seconds. No credit card required for trial.
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Find Opportunities</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Browse arbitrage and +EV opportunities across all sports and sportsbooks.
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Place Bets & Profit</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Use our calculators to determine stakes and place bets with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-zinc-600 dark:text-zinc-400">Choose the plan that works for you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-4xl font-bold mt-4">$0</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> 5 opportunities per day
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Basic odds comparison
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Betting calculators
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> 7-day historical data
                </li>
              </ul>
              <Button className="w-full mt-6" variant="outline" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-600 relative">
            <Badge className="absolute -top-3 right-4">Popular</Badge>
            <CardHeader>
              <CardTitle>Premium</CardTitle>
              <CardDescription>For serious bettors</CardDescription>
              <div className="text-4xl font-bold mt-4">
                $49<span className="text-lg text-zinc-600 dark:text-zinc-400">/mo</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Unlimited opportunities
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Real-time updates
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Instant alerts
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> 90-day historical data
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Priority support
                </li>
              </ul>
              <Button className="w-full mt-6" asChild>
                <Link href="/auth/signup">Start Free Trial</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Get Your Edge?</h2>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
          Join thousands of smart bettors using data-driven strategies to win consistently.
        </p>
        <Button size="lg" asChild>
          <Link href="/auth/signup">
            Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded" />
              <span className="font-semibold">BetEdge</span>
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              © 2025 BetEdge. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
