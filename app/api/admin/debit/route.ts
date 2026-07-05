import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdminApi } from "@/lib/admin";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function POST(req: NextRequest) {
  try {
    // 🔐 ADMIN CHECK
    const auth = await requireAdminApi();
    if (!auth.ok) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    const { userId, amount, description } = await req.json();

    const debitAmount = Number(amount);

    if (!userId || debitAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid userId or amount' },
        { status: 400 }
      );
    }

    // ================= GET BALANCE =================
    const { data: balance, error: balanceError } =
      await supabaseAdmin
        .from('balances')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (balanceError || !balance) {
      return NextResponse.json(
        { error: 'Balance not found' },
        { status: 404 }
      );
    }

    const currentCash = Number(balance.cash || 0);

    if (currentCash < debitAmount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // ================= UPDATE BALANCE =================
    const { error: updateError } = await supabaseAdmin
      .from('balances')
      .update({
        cash: currentCash - debitAmount,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    // ================= TRANSACTION =================
    await supabaseAdmin.from('transactions').insert({
      user_id: userId,
      type: 'debit',
      amount: debitAmount,
      status: 'completed',
      description: description || 'Account debited by admin',
    });

    return NextResponse.json({
      success: true,
      message: 'Account debited successfully',
    });

  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      { error: err.message || 'Failed to debit account' },
      { status: 500 }
    );
  }
}