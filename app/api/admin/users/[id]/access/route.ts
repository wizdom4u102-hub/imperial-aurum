import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
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
      return NextResponse.json(
        { error: 'No session' },
        { status: 401 }
      )
    }

    // ================= ADMIN CHECK =================
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not admin' },
        { status: 403 }
      )
    }

    // ================= PARAMS =================
    const { id: userId } = await params

    const body = await req.json()

    const action = body.action

    if (!action) {
      return NextResponse.json(
        { error: 'Action required' },
        { status: 400 }
      )
    }

    // ================= USER EXISTS =================
    const { data: existingUser } = await adminDb
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // ================= BLOCK =================
    if (action === 'block') {
      const { error } = await adminDb
        .from('profiles')
        .update({
          blocked: true,
        })
        .eq('id', userId)

      if (error) throw error

      return NextResponse.json({ success: true })
    }

    // ================= UNBLOCK =================
    if (action === 'unblock') {
      const { error } = await adminDb
        .from('profiles')
        .update({
          blocked: false,
        })
        .eq('id', userId)

      if (error) throw error

      return NextResponse.json({ success: true })
    }

    // ================= SUSPEND =================
    if (action === 'suspend') {
      const { error } = await adminDb
        .from('profiles')
        .update({
          suspended: true,
        })
        .eq('id', userId)

      if (error) throw error

      return NextResponse.json({ success: true })
    }

    // ================= UNSUSPEND =================
    if (action === 'unsuspend') {
      const { error } = await adminDb
        .from('profiles')
        .update({
          suspended: false,
        })
        .eq('id', userId)

      if (error) throw error

      return NextResponse.json({ success: true })
    }

    // ================= DELETE =================
    if (action === 'delete') {

      await adminDb
        .from('transactions')
        .delete()
        .eq('user_id', userId)

      await adminDb
        .from('balances')
        .delete()
        .eq('user_id', userId)

      await adminDb
        .from('deposits')
        .delete()
        .eq('user_id', userId)

      await adminDb
        .from('withdrawals')
        .delete()
        .eq('user_id', userId)

      await adminDb
        .from('profiles')
        .delete()
        .eq('id', userId)

      const { error } =
        await adminDb.auth.admin.deleteUser(userId)

      if (error) throw error

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (err: any) {
    console.error('ACCESS ERROR:', err)

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