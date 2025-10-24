import type { OddsEvent, PositiveEVBet } from '@/types';

/**
 * Calculate expected value (EV) of a bet
 * Formula: EV = (Probability × Profit) - ((1 - Probability) × Stake)
 * Positive EV means the bet is profitable in the long run
 */
export function calculateEV(
  odds: number,
  trueProbability: number,
  stake: number = 100
): {
  ev: number;
  evPercentage: number;
  expectedProfit: number;
} {
  const profit = (odds - 1) * stake;
  const loss = stake;

  const ev = (trueProbability * profit) - ((1 - trueProbability) * loss);
  const evPercentage = (ev / stake) * 100;
  const expectedProfit = ev;

  return {
    ev,
    evPercentage,
    expectedProfit,
  };
}

/**
 * Calculate fair odds (true probability) based on market average
 * We use the average of all bookmaker odds to estimate the "fair" odds
 */
export function calculateFairOdds(allOdds: number[]): number {
  // Remove outliers (odds that are too high or too low)
  const sorted = [...allOdds].sort((a, b) => a - b);
  const q1Index = Math.floor(sorted.length * 0.25);
  const q3Index = Math.floor(sorted.length * 0.75);

  const filtered = sorted.slice(q1Index, q3Index + 1);

  // Calculate average implied probability
  const avgImpliedProb = filtered.reduce((sum, odd) => sum + (1 / odd), 0) / filtered.length;

  // Remove vig (bookmaker margin) - assume 5% vig
  const vigAdjusted = avgImpliedProb * 0.95;

  // Convert back to odds
  return 1 / vigAdjusted;
}

/**
 * Calculate true probability from fair odds
 */
export function oddsToTrueProbability(fairOdds: number): number {
  return 1 / fairOdds;
}

/**
 * Calculate implied probability from bookmaker odds
 */
export function oddsToImpliedProbability(odds: number): number {
  return 1 / odds;
}

/**
 * Find positive EV opportunities in a single event
 */
export function findPositiveEVInEvent(
  event: OddsEvent,
  minEVPercentage: number = 2.0
): PositiveEVBet[] {
  const opportunities: PositiveEVBet[] = [];

  // Get all markets
  const marketKeys = new Set<string>();
  event.bookmakers.forEach(bookmaker => {
    bookmaker.markets.forEach(market => marketKeys.add(market.key));
  });

  // For each market, analyze each outcome
  marketKeys.forEach(marketKey => {
    const outcomeOdds: { [outcome: string]: { odds: number; bookmaker: string }[] } = {};

    event.bookmakers.forEach(bookmaker => {
      const market = bookmaker.markets.find(m => m.key === marketKey);
      if (!market) return;

      market.outcomes.forEach(outcome => {
        const key = outcome.point !== undefined
          ? `${outcome.name}_${outcome.point}`
          : outcome.name;

        if (!outcomeOdds[key]) {
          outcomeOdds[key] = [];
        }

        outcomeOdds[key].push({
          odds: outcome.price,
          bookmaker: bookmaker.title,
        });
      });
    });

    // For each outcome, calculate EV
    Object.entries(outcomeOdds).forEach(([outcomeName, oddsArray]) => {
      if (oddsArray.length < 3) return; // Need at least 3 bookmakers for fair odds

      // Calculate fair odds from market
      const allOdds = oddsArray.map(o => o.odds);
      const fairOdds = calculateFairOdds(allOdds);
      const trueProbability = oddsToTrueProbability(fairOdds);

      // Check each bookmaker's odds for +EV
      oddsArray.forEach(({ odds, bookmaker }) => {
        const { evPercentage } = calculateEV(odds, trueProbability);

        if (evPercentage >= minEVPercentage) {
          // Determine confidence based on EV percentage and sample size
          let confidence: 'high' | 'medium' | 'low' = 'low';
          if (evPercentage >= 5 && oddsArray.length >= 5) {
            confidence = 'high';
          } else if (evPercentage >= 3 || oddsArray.length >= 4) {
            confidence = 'medium';
          }

          // Calculate suggested stake using Kelly Criterion (fractional)
          const edge = trueProbability - oddsToImpliedProbability(odds);
          const kellyFraction = 0.25; // Conservative quarter Kelly
          const kellyStake = Math.max(0, (edge * kellyFraction) * 100);

          opportunities.push({
            id: `${event.id}_${marketKey}_${outcomeName}_${bookmaker}_${Date.now()}`,
            event,
            bookmaker,
            market: marketKey,
            outcome: outcomeName,
            odds,
            fair_odds: fairOdds,
            ev_percentage: evPercentage,
            confidence,
            suggested_stake: Math.min(kellyStake, 50), // Cap at 50 units
            created_at: new Date().toISOString(),
          });
        }
      });
    });
  });

  return opportunities;
}

/**
 * Find all positive EV opportunities across multiple events
 */
export function findAllPositiveEVOpportunities(
  events: OddsEvent[],
  minEVPercentage: number = 2.0
): PositiveEVBet[] {
  const allOpportunities: PositiveEVBet[] = [];

  events.forEach(event => {
    const opportunities = findPositiveEVInEvent(event, minEVPercentage);
    allOpportunities.push(...opportunities);
  });

  // Sort by EV percentage (highest first)
  return allOpportunities.sort((a, b) => b.ev_percentage - a.ev_percentage);
}

/**
 * Calculate Kelly Criterion stake
 * Formula: f* = (bp - q) / b
 * where b = decimal odds - 1, p = probability of winning, q = probability of losing
 */
export function calculateKellyStake(
  odds: number,
  winProbability: number,
  bankroll: number,
  fraction: number = 0.25 // Use fractional Kelly for safety
): number {
  const b = odds - 1;
  const p = winProbability;
  const q = 1 - p;

  const kellyPercentage = (b * p - q) / b;

  if (kellyPercentage <= 0) return 0;

  return (kellyPercentage * fraction * bankroll);
}

/**
 * Validate if a positive EV bet is still valid
 */
export function isPositiveEVValid(bet: PositiveEVBet): boolean {
  const now = new Date();
  const commenceTime = new Date(bet.event.commence_time);
  const createdAt = new Date(bet.created_at);

  // Check if event hasn't started and bet was found recently (within 15 minutes)
  const isRecent = (now.getTime() - createdAt.getTime()) < (15 * 60 * 1000);

  return now < commenceTime && isRecent;
}

/**
 * Calculate ROI (Return on Investment) for a bet
 */
export function calculateROI(stake: number, odds: number, won: boolean): number {
  if (won) {
    const profit = stake * (odds - 1);
    return (profit / stake) * 100;
  } else {
    return -100; // Lost entire stake
  }
}
