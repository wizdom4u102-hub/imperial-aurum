import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdminApi } from "@/lib/admin";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    // 🔐 ADMIN CHECK
    const auth = await requireAdminApi();
    if (!auth.ok) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    const { data: finances, error } = await supabase
      .from('balances')
      .select('*');

    if (error) throw error;

    const stats = {
      totalUsers: finances?.length || 0,

      totalBalance:
        finances?.reduce((s, f) => s + (f.total_balance || 0), 0) || 0,

      totalInvestment:
        finances?.reduce((s, f) => s + (f.total_investment || 0), 0) || 0,

      totalBonus:
        finances?.reduce((s, f) => s + (f.total_bonus || 0), 0) || 0,

      totalWithdrawals:
        finances?.reduce(
          (s, f) => s + (f.confirmed_withdrawals || 0),
          0
        ) || 0,
    };

    return NextResponse.json(stats);

  } catch (err: any) {
    console.error('❌ Admin dashboard error:', err);

    return NextResponse.json(
      { error: 'Failed to load dashboard' },
      { status: 500 }
    );
  }
}