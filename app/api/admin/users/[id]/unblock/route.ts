import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const adminDb = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
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

    const { error } = await adminDb
      .from('profiles')
      .update({
        blocked: false,
      })
      .eq('id', userId)

    if (error) {
      console.error('UNBLOCK ERROR:', error)

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
    })

  } catch (err: any) {
    console.error('UNBLOCK SERVER ERROR:', err)

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