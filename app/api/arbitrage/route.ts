import { NextRequest, NextResponse } from 'next/server';
import { oddsAPI } from '@/lib/odds-api/client';
import { findAllArbitrageOpportunities } from '@/lib/odds-api/arbitrage';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription tier
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const isPremium = userData?.subscription_tier === 'premium';

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const minProfit = parseFloat(searchParams.get('minProfit') || '0.5');
    const sport = searchParams.get('sport');

    // Fetch odds from multiple sports
    const sportKeys = sport
      ? [sport]
      : [
          'americanfootball_nfl',
          'basketball_nba',
          'baseball_mlb',
          'icehockey_nhl',
          'soccer_epl',
        ];

    const oddsData = await oddsAPI.getOddsForMultipleSports(sportKeys, ['h2h', 'spreads', 'totals']);

    // Flatten all events
    const allEvents = Object.values(oddsData).flat();

    // Find arbitrage opportunities
    const opportunities = findAllArbitrageOpportunities(allEvents, minProfit);

    // Limit opportunities for free users
    const limitedOpportunities = isPremium
      ? opportunities
      : opportunities.slice(0, 5);

    return NextResponse.json({
      data: limitedOpportunities,
      total: opportunities.length,
      isPremium,
      success: true,
    });
  } catch (error: any) {
    console.error('Error finding arbitrage opportunities:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to find arbitrage opportunities' },
      { status: 500 }
    );
  }
}
