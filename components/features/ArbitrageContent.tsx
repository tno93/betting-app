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
import { Loader2, RefreshCw, TrendingUp, Crown, AlertCircle } from 'lucide-react';
import type { ArbitrageOpportunity } from '@/types';
import Link from 'next/link';

interface ArbitrageContentProps {
  isPremium: boolean;
}

export default function ArbitrageContent({ isPremium }: ArbitrageContentProps) {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchOpportunities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/arbitrage?minProfit=0.5');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch opportunities');
      }

      setOpportunities(data.data || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Arbitrage Opportunities</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Guaranteed profit bets across multiple sportsbooks
          </p>
        </div>
        <Button onClick={fetchOpportunities} disabled={loading}>
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
                <h3 className="font-semibold text-lg mb-1">Unlock All Opportunities</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  You're seeing 5 of {total} available arbitrage opportunities. Upgrade to Premium to access all opportunities and get real-time alerts.
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
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Found</CardDescription>
            <CardTitle className="text-3xl">{total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Showing</CardDescription>
            <CardTitle className="text-3xl">{opportunities.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Best Opportunity</CardDescription>
            <CardTitle className="text-3xl">
              {opportunities.length > 0
                ? `${opportunities[0].profit_percentage.toFixed(2)}%`
                : '-'}
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

      {/* Opportunities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Opportunities</CardTitle>
          <CardDescription>
            Act fast - odds can change quickly and opportunities may disappear
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Opportunities Found</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                There are currently no arbitrage opportunities available. Check back soon!
              </p>
              <Button onClick={fetchOpportunities} variant="outline">
                Refresh
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead>Profit %</TableHead>
                    <TableHead>Bets</TableHead>
                    <TableHead>Starts</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunities.map((opp) => (
                    <TableRow key={opp.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {opp.event.away_team} @ {opp.event.home_team}
                          </div>
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">
                            {opp.event.sport_title}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{opp.market}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300">
                          +{opp.profit_percentage.toFixed(2)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {opp.bets.map((bet, idx) => (
                            <div key={idx}>
                              <span className="font-medium">{bet.bookmaker}:</span>{' '}
                              {bet.outcome} @ {bet.odds.toFixed(2)}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(opp.event.commence_time)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          Calculate Stakes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Arbitrage Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Arbitrage betting (also called "arbing" or "sure betting") guarantees profit by placing bets on all
            possible outcomes of an event across different bookmakers.
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Badge>1</Badge>
              <p className="text-sm">
                Find discrepancies in odds across different sportsbooks
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge>2</Badge>
              <p className="text-sm">
                Place calculated bets on all outcomes to guarantee profit
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge>3</Badge>
              <p className="text-sm">
                Profit regardless of the actual outcome of the event
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
