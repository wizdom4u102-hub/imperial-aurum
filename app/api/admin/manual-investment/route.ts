import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdminApi } from "@/lib/admin";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  // Check admin permission first
  const auth = await requireAdminApi();

  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error || 'Unauthorized' },
      { status: auth.status || 401 }
    );
  }

  try {
    const { userId, amount, description } = await req.json();

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json({ 
        error: 'Invalid input: userId and amount > 0 required' 
      }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const numericAmount = Number(amount);

    const { error } = await supabaseAdmin
      .from('balances')
      .update({
        current_investment: supabaseAdmin.rpc('increment', { amount: numericAmount }),
        total_investment: supabaseAdmin.rpc('increment', { amount: numericAmount }),
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Manual investment update error:', error);
      throw error;
    }

    await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'manual_investment',
        amount: numericAmount,
        description: description || 'Manual investment by admin',
        status: 'completed',
        created_at: new Date().toISOString(),
      });

    return NextResponse.json({ 
      success: true, 
      message: 'Manual investment added successfully' 
    });

  } catch (err: any) {
    console.error('Manual investment error:', err);
    return NextResponse.json({ 
      error: err.message || 'Failed to process manual investment' 
    }, { status: 500 });
  }
}