'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, Zap, DollarSign } from 'lucide-react';

export default function CalculatorsContent() {
  // Arbitrage Calculator State
  const [arbStake, setArbStake] = useState('100');
  const [arbOdds1, setArbOdds1] = useState('2.1');
  const [arbOdds2, setArbOdds2] = useState('2.2');
  const [arbResult, setArbResult] = useState<any>(null);

  // Kelly Criterion State
  const [kellyOdds, setKellyOdds] = useState('2.5');
  const [kellyProbability, setKellyProbability] = useState('45');
  const [kellyBankroll, setKellyBankroll] = useState('1000');
  const [kellyResult, setKellyResult] = useState<any>(null);

  // Standard Calculator State
  const [stdStake, setStdStake] = useState('100');
  const [stdOdds, setStdOdds] = useState('2.5');
  const [stdResult, setStdResult] = useState<any>(null);

  // ROI Calculator State
  const [roiStake, setRoiStake] = useState('100');
  const [roiReturn, setRoiReturn] = useState('150');
  const [roiResult, setRoiResult] = useState<any>(null);

  const calculateArbitrage = () => {
    const stake = parseFloat(arbStake);
    const odds1 = parseFloat(arbOdds1);
    const odds2 = parseFloat(arbOdds2);

    const impliedProb1 = 1 / odds1;
    const impliedProb2 = 1 / odds2;
    const totalProb = impliedProb1 + impliedProb2;

    const hasArbitrage = totalProb < 1;
    const profitPercent = hasArbitrage ? ((1 / totalProb - 1) * 100) : 0;

    const stake1 = (impliedProb1 / totalProb) * stake;
    const stake2 = (impliedProb2 / totalProb) * stake;

    const return1 = stake1 * odds1;
    const return2 = stake2 * odds2;
    const profit = Math.min(return1, return2) - stake;

    setArbResult({
      hasArbitrage,
      profitPercent,
      stake1,
      stake2,
      return1,
      return2,
      profit,
    });
  };

  const calculateKelly = () => {
    const odds = parseFloat(kellyOdds);
    const probability = parseFloat(kellyProbability) / 100;
    const bankroll = parseFloat(kellyBankroll);

    const b = odds - 1;
    const p = probability;
    const q = 1 - p;

    const kellyPercent = (b * p - q) / b;
    const fullKelly = Math.max(0, kellyPercent * bankroll);
    const halfKelly = fullKelly * 0.5;
    const quarterKelly = fullKelly * 0.25;

    const impliedProb = 1 / odds;
    const edge = probability - impliedProb;

    setKellyResult({
      kellyPercent: kellyPercent * 100,
      fullKelly,
      halfKelly,
      quarterKelly,
      edge: edge * 100,
    });
  };

  const calculateStandard = () => {
    const stake = parseFloat(stdStake);
    const odds = parseFloat(stdOdds);

    const potentialReturn = stake * odds;
    const potentialProfit = potentialReturn - stake;
    const impliedProbability = (1 / odds) * 100;

    setStdResult({
      potentialReturn,
      potentialProfit,
      impliedProbability,
    });
  };

  const calculateROI = () => {
    const stake = parseFloat(roiStake);
    const totalReturn = parseFloat(roiReturn);

    const profit = totalReturn - stake;
    const roi = (profit / stake) * 100;

    setRoiResult({
      profit,
      roi,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Betting Calculators</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Professional tools to calculate stakes, profits, and optimal bet sizing
        </p>
      </div>

      {/* Calculators */}
      <Tabs defaultValue="arbitrage" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="arbitrage">Arbitrage</TabsTrigger>
          <TabsTrigger value="kelly">Kelly Criterion</TabsTrigger>
          <TabsTrigger value="standard">Standard</TabsTrigger>
          <TabsTrigger value="roi">ROI</TabsTrigger>
        </TabsList>

        {/* Arbitrage Calculator */}
        <TabsContent value="arbitrage" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <CardTitle>Arbitrage Calculator</CardTitle>
              </div>
              <CardDescription>
                Calculate exact stakes needed for guaranteed profit across two outcomes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="arb-stake">Total Stake ($)</Label>
                  <Input
                    id="arb-stake"
                    type="number"
                    value={arbStake}
                    onChange={(e) => setArbStake(e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arb-odds1">Outcome 1 Odds</Label>
                  <Input
                    id="arb-odds1"
                    type="number"
                    step="0.01"
                    value={arbOdds1}
                    onChange={(e) => setArbOdds1(e.target.value)}
                    placeholder="2.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arb-odds2">Outcome 2 Odds</Label>
                  <Input
                    id="arb-odds2"
                    type="number"
                    step="0.01"
                    value={arbOdds2}
                    onChange={(e) => setArbOdds2(e.target.value)}
                    placeholder="2.2"
                  />
                </div>
              </div>

              <Button onClick={calculateArbitrage} className="w-full">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate
              </Button>

              {arbResult && (
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 space-y-3">
                  {arbResult.hasArbitrage ? (
                    <>
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="font-medium">Arbitrage Exists</span>
                        <span className="text-green-600 font-bold">
                          +{arbResult.profitPercent.toFixed(2)}%
                        </span>
                      </div>
                      <div className="grid gap-2 md:grid-cols-2">
                        <div>
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">Stake on Outcome 1</div>
                          <div className="text-lg font-semibold">${arbResult.stake1.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">Stake on Outcome 2</div>
                          <div className="text-lg font-semibold">${arbResult.stake2.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">Return if Outcome 1</div>
                          <div className="text-lg font-semibold">${arbResult.return1.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">Return if Outcome 2</div>
                          <div className="text-lg font-semibold">${arbResult.return2.toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="bg-green-100 dark:bg-green-950 rounded p-3 mt-2">
                        <div className="text-sm text-green-800 dark:text-green-200">Guaranteed Profit</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          ${arbResult.profit.toFixed(2)}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-red-600">
                      No arbitrage opportunity exists with these odds
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kelly Criterion Calculator */}
        <TabsContent value="kelly" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                <CardTitle>Kelly Criterion Calculator</CardTitle>
              </div>
              <CardDescription>
                Calculate optimal stake size based on your edge and bankroll
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="kelly-odds">Odds</Label>
                  <Input
                    id="kelly-odds"
                    type="number"
                    step="0.01"
                    value={kellyOdds}
                    onChange={(e) => setKellyOdds(e.target.value)}
                    placeholder="2.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kelly-prob">Win Probability (%)</Label>
                  <Input
                    id="kelly-prob"
                    type="number"
                    step="0.1"
                    value={kellyProbability}
                    onChange={(e) => setKellyProbability(e.target.value)}
                    placeholder="45"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kelly-bankroll">Bankroll ($)</Label>
                  <Input
                    id="kelly-bankroll"
                    type="number"
                    value={kellyBankroll}
                    onChange={(e) => setKellyBankroll(e.target.value)}
                    placeholder="1000"
                  />
                </div>
              </div>

              <Button onClick={calculateKelly} className="w-full">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate
              </Button>

              {kellyResult && (
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-medium">Your Edge</span>
                    <span className={`font-bold ${kellyResult.edge > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {kellyResult.edge > 0 ? '+' : ''}{kellyResult.edge.toFixed(2)}%
                    </span>
                  </div>

                  {kellyResult.edge > 0 ? (
                    <>
                      <div className="grid gap-2">
                        <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-950 rounded p-3">
                          <div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">Full Kelly</div>
                            <div className="text-xs text-zinc-500">Aggressive (not recommended)</div>
                          </div>
                          <div className="text-lg font-semibold">${kellyResult.fullKelly.toFixed(2)}</div>
                        </div>
                        <div className="flex justify-between items-center bg-purple-50 dark:bg-purple-950 rounded p-3">
                          <div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">Half Kelly</div>
                            <div className="text-xs text-zinc-500">Moderate (recommended)</div>
                          </div>
                          <div className="text-lg font-semibold">${kellyResult.halfKelly.toFixed(2)}</div>
                        </div>
                        <div className="flex justify-between items-center bg-green-50 dark:bg-green-950 rounded p-3">
                          <div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">Quarter Kelly</div>
                            <div className="text-xs text-zinc-500">Conservative (safest)</div>
                          </div>
                          <div className="text-lg font-semibold">${kellyResult.quarterKelly.toFixed(2)}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-red-600">
                      No edge - Kelly Criterion suggests not betting
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Standard Calculator */}
        <TabsContent value="standard" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <CardTitle>Standard Bet Calculator</CardTitle>
              </div>
              <CardDescription>
                Calculate potential returns and implied probability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="std-stake">Stake ($)</Label>
                  <Input
                    id="std-stake"
                    type="number"
                    value={stdStake}
                    onChange={(e) => setStdStake(e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="std-odds">Odds</Label>
                  <Input
                    id="std-odds"
                    type="number"
                    step="0.01"
                    value={stdOdds}
                    onChange={(e) => setStdOdds(e.target.value)}
                    placeholder="2.5"
                  />
                </div>
              </div>

              <Button onClick={calculateStandard} className="w-full">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate
              </Button>

              {stdResult && (
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 space-y-3">
                  <div className="grid gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600 dark:text-zinc-400">Potential Return</span>
                      <span className="text-xl font-semibold">${stdResult.potentialReturn.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600 dark:text-zinc-400">Potential Profit</span>
                      <span className="text-xl font-semibold text-green-600">
                        +${stdResult.potentialProfit.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="text-zinc-600 dark:text-zinc-400">Implied Probability</span>
                      <span className="text-lg font-semibold">{stdResult.impliedProbability.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROI Calculator */}
        <TabsContent value="roi" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-orange-600" />
                <CardTitle>ROI Calculator</CardTitle>
              </div>
              <CardDescription>
                Calculate return on investment for past bets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="roi-stake">Amount Staked ($)</Label>
                  <Input
                    id="roi-stake"
                    type="number"
                    value={roiStake}
                    onChange={(e) => setRoiStake(e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roi-return">Total Return ($)</Label>
                  <Input
                    id="roi-return"
                    type="number"
                    value={roiReturn}
                    onChange={(e) => setRoiReturn(e.target.value)}
                    placeholder="150"
                  />
                </div>
              </div>

              <Button onClick={calculateROI} className="w-full">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate ROI
              </Button>

              {roiResult && (
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 space-y-3">
                  <div className="grid gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600 dark:text-zinc-400">Profit/Loss</span>
                      <span className={`text-xl font-semibold ${roiResult.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {roiResult.profit >= 0 ? '+' : ''}${roiResult.profit.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="text-zinc-600 dark:text-zinc-400">ROI</span>
                      <span className={`text-2xl font-bold ${roiResult.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {roiResult.roi >= 0 ? '+' : ''}{roiResult.roi.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
