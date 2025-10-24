import axios from 'axios';
import type { OddsEvent, Sport, MarketType } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_ODDS_API_BASE_URL || 'https://api.the-odds-api.com/v4';
const API_KEY = process.env.ODDS_API_KEY;

export class OddsAPIClient {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    // Allow build-time without API key, but warn
    if (!API_KEY && process.env.NODE_ENV !== 'production') {
      console.warn('ODDS_API_KEY is not defined - API calls will fail');
    }
    this.apiKey = API_KEY || '';
    this.baseURL = BASE_URL;
  }

  /**
   * Get available sports
   */
  async getSports(): Promise<Sport[]> {
    if (!this.apiKey) {
      throw new Error('ODDS_API_KEY is not configured');
    }
    try {
      const response = await axios.get(`${this.baseURL}/sports`, {
        params: {
          apiKey: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sports:', error);
      throw error;
    }
  }

  /**
   * Get odds for a specific sport
   * @param sportKey - The sport key (e.g., 'americanfootball_nfl')
   * @param markets - Markets to fetch (e.g., ['h2h', 'spreads', 'totals'])
   * @param regions - Regions to fetch odds from (e.g., ['us', 'uk', 'eu', 'au'])
   * @param oddsFormat - Format of odds ('decimal', 'american')
   */
  async getOdds(
    sportKey: string,
    markets: MarketType[] = ['h2h'],
    regions: string[] = ['us'],
    oddsFormat: 'decimal' | 'american' = 'decimal'
  ): Promise<OddsEvent[]> {
    if (!this.apiKey) {
      throw new Error('ODDS_API_KEY is not configured');
    }
    try {
      const response = await axios.get(`${this.baseURL}/sports/${sportKey}/odds`, {
        params: {
          apiKey: this.apiKey,
          regions: regions.join(','),
          markets: markets.join(','),
          oddsFormat,
          dateFormat: 'iso',
        },
      });

      // Log remaining requests
      const remainingRequests = response.headers['x-requests-remaining'];
      const usedRequests = response.headers['x-requests-used'];
      console.log(`API Requests - Used: ${usedRequests}, Remaining: ${remainingRequests}`);

      return response.data;
    } catch (error) {
      console.error(`Error fetching odds for ${sportKey}:`, error);
      throw error;
    }
  }

  /**
   * Get odds for multiple sports
   */
  async getOddsForMultipleSports(
    sportKeys: string[],
    markets: MarketType[] = ['h2h'],
    regions: string[] = ['us']
  ): Promise<{ [sportKey: string]: OddsEvent[] }> {
    const results: { [sportKey: string]: OddsEvent[] } = {};

    // Fetch odds for each sport sequentially to avoid rate limits
    for (const sportKey of sportKeys) {
      try {
        const odds = await this.getOdds(sportKey, markets, regions);
        results[sportKey] = odds;
      } catch (error) {
        console.error(`Failed to fetch odds for ${sportKey}:`, error);
        results[sportKey] = [];
      }
    }

    return results;
  }

  /**
   * Get historical odds (requires paid plan)
   */
  async getHistoricalOdds(
    sportKey: string,
    date: string,
    markets: MarketType[] = ['h2h']
  ): Promise<OddsEvent[]> {
    try {
      const response = await axios.get(`${this.baseURL}/historical/sports/${sportKey}/odds`, {
        params: {
          apiKey: this.apiKey,
          date, // Format: 2024-01-15T12:00:00Z
          markets: markets.join(','),
          dateFormat: 'iso',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching historical odds:', error);
      throw error;
    }
  }

  /**
   * Get event scores
   */
  async getScores(sportKey: string, daysFrom: number = 1): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseURL}/sports/${sportKey}/scores`, {
        params: {
          apiKey: this.apiKey,
          daysFrom,
          dateFormat: 'iso',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching scores:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const oddsAPI = new OddsAPIClient();
