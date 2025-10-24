import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CalculatorsContent from '@/components/features/CalculatorsContent';

export default async function CalculatorsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Get user data
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <DashboardLayout
      user={{
        email: user.email,
        full_name: userData?.full_name,
        subscription_tier: userData?.subscription_tier,
      }}
    >
      <CalculatorsContent />
    </DashboardLayout>
  );
}
