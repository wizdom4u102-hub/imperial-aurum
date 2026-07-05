import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import DepositClient from './DepositClient';

export default async function NewDepositPage() {
  const supabase = await createClient();

  const { data: methods, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-semibold mb-8">New Deposit</h1>

        <p className="text-zinc-400 mb-8">
          Enter amount and choose a payment method.
        </p>

        {/* 👇 CLIENT COMPONENT */}
        <DepositClient methods={methods || []} />

        <div className="mt-10">
          <Link href="/dashboard" className="text-yellow-400 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}