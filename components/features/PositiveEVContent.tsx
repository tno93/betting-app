'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, RefreshCw, Zap, Crown, AlertCircle } from 'lucide-react';
import type { PositiveEVBet } from '@/types';
import Link from 'next/link';

interface PositiveEVContentProps {
  isPremium: boolean;
}

export default function PositiveEVContent({ isPremium }: PositiveEVContentProps) {
  const [bets, setBets] = useState<PositiveEVBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchBets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/positive-ev?minEV=2.0');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch bets');
      }

      setBets(data.data || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300',
      medium: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300',
      low: 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300',
    };
    return colors[confidence as keyof typeof colors] || colors.low;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Positive EV Bets</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Mathematically favorable bets for long-term profitability
          </p>
        </div>
        <Button onClick={fetchBets} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Premium Banner */}
      {!isPremium && total > 5 && (
        <Card className="border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Crown className="h-8 w-8 text-yellow-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Unlock All +EV Opportunities</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  You're seeing 5 of {total} available positive EV bets. Upgrade to Premium to access all bets and get real-time alerts.
                </p>
                <Button asChild size="sm">
                  <Link href="/settings?tab=subscription">Upgrade to Premium</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Found</CardDescription>
            <CardTitle className="text-3xl">{total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Showing</CardDescription>
            <CardTitle className="text-3xl">{bets.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Best EV</CardDescription>
            <CardTitle className="text-3xl">
              {bets.length > 0 ? `+${bets[0].ev_percentage.toFixed(1)}%` : '-'}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>High Confidence</CardDescription>
            <CardTitle className="text-3xl">
              {bets.filter((b) => b.confidence === 'high').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 dark:border-red-900">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              This might be due to API rate limits or configuration issues. Please check your setup.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Bets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Positive EV Bets</CardTitle>
          <CardDescription>
            Bets where the odds are in your favor for long-term profitability
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
          ) : bets.length === 0 ? (
            <div className="text-center py-12">
              <Zap className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Positive EV Bets Found</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                There are currently no positive EV opportunities available. Check back soon!
              </p>
              <Button onClick={fetchBets} variant="outline">
                Refresh
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Bookmaker</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead>Pick</TableHead>
                    <TableHead>Odds</TableHead>
                    <TableHead>EV %</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Suggested Stake</TableHead>
                    <TableHead>Starts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bets.map((bet) => (
                    <TableRow key={bet.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {bet.event.away_team} @ {bet.event.home_team}
                          </div>
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">
                            {bet.event.sport_title}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{bet.bookmaker}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{bet.market}</Badge>
                      </TableCell>
                      <TableCell>{bet.outcome}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{bet.odds.toFixed(2)}</div>
                          <div className="text-xs text-zinc-500">
                            Fair: {bet.fair_odds.toFixed(2)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          +{bet.ev_percentage.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getConfidenceBadge(bet.confidence)}>
                          {bet.confidence}
                        </Badge>
                      </TableCell>
                      <TableCell>${bet.suggested_stake.toFixed(0)}</TableCell>
                      <TableCell className="text-sm">
                        {formatDate(bet.event.commence_time)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card>
        <CardHeader>
          <CardTitle>What is Positive EV?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Positive Expected Value (+EV) betting means you have a mathematical edge over the bookmaker.
            While individual bets can still lose, betting on +EV opportunities consistently will be
            profitable in the long run.
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Badge>Formula</Badge>
              <p className="text-sm">
                EV = (Probability of Winning × Amount Won) - (Probability of Losing × Amount Lost)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge>Example</Badge>
              <p className="text-sm">
                If fair odds are 2.50 (40% chance) but a bookmaker offers 2.80, you have +12% EV
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge>Strategy</Badge>
              <p className="text-sm">
                Use Kelly Criterion for stake sizing and only bet when EV is significantly positive (2%+)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
