import type { OddsEvent, ArbitrageOpportunity, Outcome } from '@/types';

/**
 * Calculate if an arbitrage opportunity exists
 * Formula: 1/odds1 + 1/odds2 < 1 means arbitrage exists
 */
export function calculateArbitrage(odds: number[]): {
  hasArbitrage: boolean;
  profitPercentage: number;
  stakes: number[];
} {
  // Calculate implied probabilities
  const impliedProbabilities = odds.map(odd => 1 / odd);
  const totalProbability = impliedProbabilities.reduce((sum, prob) => sum + prob, 0);

  const hasArbitrage = totalProbability < 1;
  const profitPercentage = hasArbitrage ? ((1 / totalProbability - 1) * 100) : 0;

  // Calculate stakes for each bet (normalized to total stake of 100)
  const stakes = impliedProbabilities.map(prob => (prob / totalProbability) * 100);

  return {
    hasArbitrage,
    profitPercentage,
    stakes,
  };
}

/**
 * Find arbitrage opportunities in a single event across multiple bookmakers
 */
export function findArbitrageInEvent(event: OddsEvent, minProfitPercentage: number = 0.5): ArbitrageOpportunity[] {
  const opportunities: ArbitrageOpportunity[] = [];

  // Get all markets
  const marketKeys = new Set<string>();
  event.bookmakers.forEach(bookmaker => {
    bookmaker.markets.forEach(market => marketKeys.add(market.key));
  });

  // For each market, find the best odds for each outcome
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

    // Find the best odds for each outcome
    const outcomeNames = Object.keys(outcomeOdds);
    if (outcomeNames.length < 2) return; // Need at least 2 outcomes

    const bestOdds = outcomeNames.map(name => {
      const oddsArray = outcomeOdds[name];
      return oddsArray.reduce((best, current) =>
        current.odds > best.odds ? current : best
      );
    });

    // Calculate if arbitrage exists
    const odds = bestOdds.map(b => b.odds);
    const arbitrage = calculateArbitrage(odds);

    if (arbitrage.hasArbitrage && arbitrage.profitPercentage >= minProfitPercentage) {
      const totalStake = 100; // Default stake
      const bets = bestOdds.map((best, index) => ({
        bookmaker: best.bookmaker,
        outcome: outcomeNames[index],
        odds: best.odds,
        stake: arbitrage.stakes[index],
        potential_return: arbitrage.stakes[index] * best.odds,
      }));

      opportunities.push({
        id: `${event.id}_${marketKey}_${Date.now()}`,
        event,
        market: marketKey,
        profit_percentage: arbitrage.profitPercentage,
        total_stake: totalStake,
        bets,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // Expires in 10 minutes
        created_at: new Date().toISOString(),
      });
    }
  });

  return opportunities;
}

/**
 * Find all arbitrage opportunities across multiple events
 */
export function findAllArbitrageOpportunities(
  events: OddsEvent[],
  minProfitPercentage: number = 0.5
): ArbitrageOpportunity[] {
  const allOpportunities: ArbitrageOpportunity[] = [];

  events.forEach(event => {
    const opportunities = findArbitrageInEvent(event, minProfitPercentage);
    allOpportunities.push(...opportunities);
  });

  // Sort by profit percentage (highest first)
  return allOpportunities.sort((a, b) => b.profit_percentage - a.profit_percentage);
}

/**
 * Calculate stake distribution for custom total stake
 */
export function calculateStakeDistribution(
  odds: number[],
  totalStake: number
): { stakes: number[]; guaranteedProfit: number } {
  const arbitrage = calculateArbitrage(odds);

  if (!arbitrage.hasArbitrage) {
    throw new Error('No arbitrage opportunity exists for these odds');
  }

  const stakes = arbitrage.stakes.map(stakePercent => (stakePercent / 100) * totalStake);
  const guaranteedProfit = (arbitrage.profitPercentage / 100) * totalStake;

  return { stakes, guaranteedProfit };
}

/**
 * Validate if an arbitrage opportunity is still valid
 */
export function isArbitrageValid(opportunity: ArbitrageOpportunity): boolean {
  const now = new Date();
  const expiresAt = new Date(opportunity.expires_at);
  const commenceTime = new Date(opportunity.event.commence_time);

  // Check if expired or event already started
  return now < expiresAt && now < commenceTime;
}
