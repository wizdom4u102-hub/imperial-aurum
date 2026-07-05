import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const adminDb = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id: userId } =
      await params

    console.log(
      '=========== UNSUSPEND USER =========='
    )

    console.log(
      'USER ID:',
      userId
    )

    // ================= AUTH =================
    const supabase =
      await createClient()

    const {
      data: { user },
      error: authError,
    } =
      await supabase.auth.getUser()

    if (
      authError ||
      !user
    ) {

      console.error(
        '❌ AUTH ERROR:',
        authError
      )

      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      )
    }

    // ================= ADMIN CHECK =================
    if (
      user.email !==
      'admin@imperialaurum.com'
    ) {

      console.error(
        '❌ NOT ADMIN:',
        user.email
      )

      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 403,
        }
      )
    }

    // ================= UNSUSPEND USER =================
    const {
      data: updatedUser,
      error: updateError,
    } =
      await adminDb
        .from('profiles')
        .update({

          suspended: false,

          status: 'active',

          updated_at:
            new Date().toISOString(),

        })
        .eq(
          'id',
          userId
        )
        .select()
        .single()

    if (
      updateError
    ) {

      console.error(
        '❌ UNSUSPEND ERROR:',
        updateError
      )

      return NextResponse.json(
        {
          error:
            updateError.message,
        },
        {
          status: 500,
        }
      )
    }

    console.log(
      '✅ USER UNSUSPENDED:',
      updatedUser
    )

    // ================= SUCCESS =================
    return NextResponse.json({
      success: true,
      user: updatedUser,
    })

  } catch (err: any) {

    console.error(
      '❌ UNSUSPEND SERVER ERROR:',
      err
    )

    return NextResponse.json(
      {
        error:
          err.message ||
          'Server error',
      },
      {
        status: 500,
      }
    )
  }
}