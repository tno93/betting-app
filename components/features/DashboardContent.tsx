'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, Calculator, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function DashboardContent() {
  const [stats, setStats] = useState({
    arbitrageCount: 0,
    positiveEVCount: 0,
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [arbResponse, evResponse] = await Promise.all([
          fetch('/api/arbitrage?minProfit=0.5'),
          fetch('/api/positive-ev?minEV=2.0'),
        ]);

        const arbData = await arbResponse.json();
        const evData = await evResponse.json();

        setStats({
          arbitrageCount: arbData.total || 0,
          positiveEVCount: evData.total || 0,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        setStats({
          arbitrageCount: 0,
          positiveEVCount: 0,
          loading: false,
          error: error.message || 'Failed to load statistics',
        });
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Here's what's happening with your betting opportunities today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arbitrage Opportunities</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.arbitrageCount}</div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  Guaranteed profit opportunities
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive EV Bets</CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.positiveEVCount}</div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  Long-term profitable bets
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tools Available</CardTitle>
            <Calculator className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Betting calculators ready to use
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error State */}
      {stats.error && (
        <Card className="border-red-200 dark:border-red-900">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p>{stats.error}</p>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Please check your API configuration and try again.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Find Arbitrage</CardTitle>
              <CardDescription>
                Discover risk-free betting opportunities with guaranteed profit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-950">
                <Link href="/arbitrage">
                  View Opportunities <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-950 rounded-lg flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Positive EV Bets</CardTitle>
              <CardDescription>
                Find mathematically favorable bets for long-term profit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full group-hover:bg-purple-50 dark:group-hover:bg-purple-950">
                <Link href="/positive-ev">
                  View Bets <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center mb-2">
                <Calculator className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Use Calculators</CardTitle>
              <CardDescription>
                Calculate stakes, profits, Kelly Criterion, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full group-hover:bg-green-50 dark:group-hover:bg-green-950">
                <Link href="/calculators">
                  Open Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Getting Started Guide */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle>Getting Started with BetEdge</CardTitle>
          <CardDescription>Follow these steps to maximize your profits</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <Badge className="mt-0.5">1</Badge>
              <div>
                <p className="font-medium">Browse Opportunities</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Check arbitrage and positive EV sections for profitable bets
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Badge className="mt-0.5">2</Badge>
              <div>
                <p className="font-medium">Use Calculators</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Calculate exact stakes and expected returns before betting
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Badge className="mt-0.5">3</Badge>
              <div>
                <p className="font-medium">Place Your Bets</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Open accounts with recommended sportsbooks and place bets
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Badge className="mt-0.5">4</Badge>
              <div>
                <p className="font-medium">Track Performance</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Monitor your bets and analyze ROI in the settings page
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pro Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 bg-blue-600 rounded-full mt-2" />
            <p className="text-sm">
              <strong>Act Fast:</strong> Arbitrage opportunities can disappear quickly as odds change
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 bg-purple-600 rounded-full mt-2" />
            <p className="text-sm">
              <strong>Bankroll Management:</strong> Never bet more than 1-5% of your bankroll on a single bet
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 bg-green-600 rounded-full mt-2" />
            <p className="text-sm">
              <strong>Multiple Accounts:</strong> Have accounts with multiple sportsbooks to maximize opportunities
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 bg-orange-600 rounded-full mt-2" />
            <p className="text-sm">
              <strong>Verify Odds:</strong> Always double-check odds on the sportsbook before placing bets
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
