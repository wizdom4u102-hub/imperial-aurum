import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: withdrawalId } = await params

    const { data: withdrawal } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', withdrawalId)
      .single();

    if (!withdrawal) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // ✅ mark completed
    await supabase
      .from('withdrawals')
      .update({ status: 'completed' })
      .eq('id', withdrawalId);

    // ✅ deduct balance
    await supabase.rpc('increment_cash', {
  user_uuid: withdrawal.user_id,
  amount: -withdrawal.amount,
});

    // ✅ transaction
    await supabase.from('transactions').insert({
      user_id: withdrawal.user_id,
      type: 'withdrawal',
      amount: withdrawal.amount,
      status: 'completed',
      description: 'Withdrawal approved',
    });

    return NextResponse.json({ success: true });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}