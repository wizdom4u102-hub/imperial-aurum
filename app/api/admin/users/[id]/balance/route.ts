import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const adminDb = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
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

    const { data, error } = await adminDb
      .from('balances')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('BALANCE FETCH ERROR:', error)

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data || {
      cash: 0,
      gold: 0,
      shares: 0,
    })

  } catch (err: any) {
    console.error('BALANCE API ERROR:', err)

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