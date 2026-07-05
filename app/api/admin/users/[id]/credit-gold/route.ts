import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// ✅ admin database client
const adminDb = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ GET USER ID
    const { id: userId } = await params

    // ✅ AUTH
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // ✅ ADMIN CHECK
    if (!user || user.email !== 'admin@imperialaurum.com') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // ✅ BODY
    const body = await req.json()

    const amount = Number(body.amount)

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // ✅ GET USER BALANCE
    const { data: existingUser, error: fetchError } =
      await adminDb
        .from('balances')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

    if (fetchError) {
      console.error(fetchError)

      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      )
    }

    let updateError = null

    // ✅ UPDATE EXISTING GOLD
    if (existingUser) {
      const { error } = await adminDb
        .from('balances')
        .update({
          gold: Number(existingUser.gold || 0) + amount,
        })
        .eq('user_id', userId)

      updateError = error
    }

    // ✅ CREATE NEW BALANCE
    else {
      const { error } = await adminDb
        .from('balances')
        .insert({
          user_id: userId,
          cash: 0,
          gold: amount,
          shares: 0,
        })

      updateError = error
    }

    // ✅ HANDLE ERROR
    if (updateError) {
      console.error(updateError)

      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }

    // ✅ LOG TRANSACTION
    const { error: txError } = await adminDb
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'gold',
        amount,
        status: 'completed',
        description: 'Admin credited gold',
      })

    if (txError) {
      console.error(txError)

      return NextResponse.json(
        { error: txError.message },
        { status: 500 }
      )
    }

    // ✅ SUCCESS
    return NextResponse.json({
      success: true,
    })

  } catch (err) {
    console.error('❌ credit gold error:', err)

    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}