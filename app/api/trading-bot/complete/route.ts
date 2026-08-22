import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST() {
  try {
    const supabase = supabaseAdmin

    const now = new Date().toISOString();

    const { data: bots, error } = await supabase
      .from('user_trading_bots')
      .select('*')
      .eq('status', 'running')
      .lte('expires_at', now);

    if (error) {
      throw error;
    }

    for (const bot of bots ?? []) {
      const finalAmount =
        Number(bot.invested_amount) +
        Number(bot.total_profit);

      await supabase
        .from('user_trading_bots')
        .update({
          status: 'completed',
          completed_at: now,
          final_amount: finalAmount,
          updated_at: now,
        })
        .eq('id', bot.id);

      const { data: balance } = await supabase
        .from('balances')
        .select('cash')
        .eq('user_id', bot.user_id)
        .single();

      await supabase
        .from('balances')
        .update({
          cash:
            Number(balance?.cash ?? 0) +
            finalAmount,
          updated_at: now,
        })
        .eq('user_id', bot.user_id);

      await supabase
        .from('transactions')
        .insert({
          user_id: bot.user_id,
          type: 'trading_bot_completed',
          amount: finalAmount,
          asset_type: 'cash',
          status: 'completed',
          description:
            'Trading bot completed successfully',
          reference_id: bot.id,
        });

      /*
       * EMAIL WILL BE ADDED HERE
       *
       * await sendTradingBotCompletedEmail(...)
       *
       * Includes:
       * - Investment
       * - Total profit
       * - ROI
       * - Final payout
       * - Duration
       */
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error(
      'Trading Bot Completion Error:',
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ??
          'Unable to complete trading bots.',
      },
      {
        status: 500,
      }
    );
  }
}