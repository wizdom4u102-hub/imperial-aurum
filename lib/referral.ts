import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* ================= COMMISSION RATES ================= */
const getRate = (level: number) => {
  if (level === 1) return 0.10;     // 10%
  if (level <= 3) return 0.05;      // 5%
  if (level <= 10) return 0.03;     // 3%
  return 0.02;                      // 2%
};

/* ================= MAIN FUNCTION ================= */
export async function processReferralCommission(userId: string, amount: number) {
  try {
    let current = userId;
    let level = 1;
    const MAX = 20;

    const payouts: { userId: string; level: number; commission: number }[] = [];

    while (level <= MAX) {
      const { data } = await supabase
        .from('profiles')
        .select('referrer_id')
        .eq('id', current)
        .single();

      if (!data?.referrer_id) break;

      current = data.referrer_id;

      const rate = getRate(level);
      const commission = Number((amount * rate).toFixed(2));

      payouts.push({ userId: current, level, commission });

      level++;
    }

    /* ================= APPLY PAYMENTS ================= */
    for (const p of payouts) {
      const { data: finance, error: fetchError } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', p.userId)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching balance:', fetchError);
        continue;
      }

      if (!finance) {
        await supabase
          .from('balances')
          .insert({
            user_id: p.userId,
            cash: p.commission,
            total_bonus: p.commission,
          });
      } else {
        await supabase
          .from('balances')
          .update({
            cash: Number(finance.cash || 0) + p.commission,
            total_bonus: Number(finance.total_bonus || 0) + p.commission,
          })
          .eq('user_id', p.userId);
      }

      // Log transaction
      await supabase.from('transactions').insert({
        user_id: p.userId,
        type: 'referral',
        amount: p.commission,
        description: `Level ${p.level} referral commission`,
      });
    }

    /* ================= $50 BONUS FOR 10 REFERRALS ================= */
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', userId);

    if (count && count >= 10) {
      await supabase
        .from('balances')
        .update({
          cash: supabase.rpc('increment', { amount: 50 }),
          total_bonus: supabase.rpc('increment', { amount: 50 }),
        })
        .eq('user_id', userId);

      await supabase.from('transactions').insert({
        user_id: userId,
        type: 'bonus',
        amount: 50,
        description: 'Referral milestone bonus (10 users)',
      });
    }
  } catch (err) {
    console.error('❌ Referral error:', err);
  }
}