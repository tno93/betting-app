'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Check } from 'lucide-react';
import Link from 'next/link';

interface SettingsContentProps {
  user: any;
}

export default function SettingsContent({ user }: SettingsContentProps) {
  const isPremium = user?.subscription_tier === 'premium';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage your account and subscription
        </p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your personal account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3">
            <div className="flex justify-between items-center">
              <span className="text-zinc-600 dark:text-zinc-400">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-600 dark:text-zinc-400">Full Name</span>
              <span className="font-medium">{user?.full_name || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-600 dark:text-zinc-400">Subscription</span>
              <Badge className={isPremium ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300' : ''}>
                {isPremium ? (
                  <>
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </>
                ) : (
                  'Free'
                )}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Subscription Plans</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <Card className={!isPremium ? 'border-blue-200 dark:border-blue-900' : ''}>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <div className="text-3xl font-bold">$0<span className="text-sm text-zinc-600 dark:text-zinc-400">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">5 opportunities per day</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Basic odds comparison</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">All betting calculators</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">7-day historical data</span>
                </li>
              </ul>
              {!isPremium && (
                <Badge className="w-full justify-center">Current Plan</Badge>
              )}
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className={isPremium ? 'border-yellow-200 dark:border-yellow-900 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950' : 'border-blue-600'}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  Premium
                </CardTitle>
                {!isPremium && <Badge>Popular</Badge>}
              </div>
              <div className="text-3xl font-bold">$49<span className="text-sm text-zinc-600 dark:text-zinc-400">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Unlimited opportunities</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Real-time updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Instant email alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">90-day historical data</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Advanced analytics</span>
                </li>
              </ul>
              {isPremium ? (
                <Badge className="w-full justify-center bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300">
                  <Crown className="h-3 w-3 mr-1" />
                  Current Plan
                </Badge>
              ) : (
                <Button className="w-full" size="lg">
                  Upgrade to Premium
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Info Box */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
        <CardContent className="pt-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <strong>Note:</strong> Stripe integration is not yet configured. To enable premium subscriptions,
            you'll need to set up Stripe according to the SETUP_GUIDE.md instructions.
          </p>
        </CardContent>
      </Card>

      {/* Helpful Links */}
      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="https://the-odds-api.com/account/" target="_blank" rel="noopener noreferrer">
              Check API Usage
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
