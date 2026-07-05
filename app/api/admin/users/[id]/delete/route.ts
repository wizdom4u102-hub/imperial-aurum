import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const adminDb = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.email !== 'admin@imperialaurum.com') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // ✅ DELETE RELATED DATA
    await adminDb.from('transactions').delete().eq('user_id', userId)
    await adminDb.from('deposits').delete().eq('user_id', userId)
    await adminDb.from('withdrawals').delete().eq('user_id', userId)
    await adminDb.from('balances').delete().eq('user_id', userId)

    // ✅ DELETE PROFILE
    await adminDb.from('profiles').delete().eq('id', userId)

    // ✅ DELETE AUTH USER
    const { error } =
      await adminDb.auth.admin.deleteUser(userId)

    if (error) {
      console.error('DELETE USER ERROR:', error)

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
    })

  } catch (err: any) {
    console.error('DELETE SERVER ERROR:', err)

    return NextResponse.json(
      {
        error: err.message || 'Server error',
      },
      {
        status: 500,
      }
    )
  }
}