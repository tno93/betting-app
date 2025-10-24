import { NextRequest, NextResponse } from 'next/server';
import { oddsAPI } from '@/lib/odds-api/client';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const sport = searchParams.get('sport') || 'upcoming';
    const markets = searchParams.get('markets')?.split(',') || ['h2h'];

    // Fetch odds from The Odds API
    let odds;
    if (sport === 'upcoming') {
      // Get multiple popular sports
      const sportKeys = [
        'americanfootball_nfl',
        'basketball_nba',
        'baseball_mlb',
        'icehockey_nhl',
        'soccer_epl',
      ];
      odds = await oddsAPI.getOddsForMultipleSports(sportKeys, markets as any);
    } else {
      odds = await oddsAPI.getOdds(sport, markets as any);
    }

    return NextResponse.json({ data: odds, success: true });
  } catch (error: any) {
    console.error('Error fetching odds:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch odds' },
      { status: 500 }
    );
  }
}
