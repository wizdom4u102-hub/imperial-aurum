import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const adminDb = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ================= AUTH =================
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No session' }, { status: 401 })
    }

    // ================= ADMIN CHECK =================
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Not admin' }, { status: 403 })
    }

    // ================= PARAMS =================
    const { id: userId } = await params

    const body = await req.json()
    const { action, amount } = body

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Missing or invalid data' }, { status: 400 })
    }

    // ================= VALIDATE USER EXISTS (CRITICAL FIX) =================
    const { data: existingUser } = await adminDb
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (!existingUser) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    // ================= ENSURE BALANCE EXISTS =================
    let { data: balance, error } = await adminDb
      .from('balances')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error

    if (!balance) {
      const { data: newBalance, error: insertError } = await adminDb
        .from('balances')
        .insert({
          user_id: userId,
          cash: 0,
          gold: 0,
          shares: 0,
        })
        .select()
        .single()

      if (insertError) throw insertError
      balance = newBalance
    }

    // ================= VALIDATE ACTION =================
    const allowedActions = [
  'credit',
  'debit',
  'bonus',
  'investment',
  'gold',
]

    if (!allowedActions.includes(action)) {
      return NextResponse.json({ error: 'Invalid action type' }, { status: 400 })
    }

    // ================= ATOMIC UPDATE VIA RPC =================
    const { error: rpcError } = await adminDb.rpc('update_balance_atomic', {
      p_user_id: userId,
      p_action: action,
      p_amount: amount,
    })

    if (rpcError) throw rpcError

    // ================= SAFE TRANSACTION LOG =================
    await adminDb
  .from('transactions')
  .insert({
    user_id: userId,
    type: action,
    amount,
    status: 'completed',
    description: `Admin ${action}`,
  })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('❌ ACTION ERROR:', err)

    return NextResponse.json(
      { error: 'Action failed', details: String(err) },
      { status: 500 }
    )
  }
}