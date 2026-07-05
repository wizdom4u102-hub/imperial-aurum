import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const adminDb = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await req.formData()

    const user_id =
      formData.get('user_id') as string

    const subject =
      formData.get('subject') as string

    const message =
      formData.get('message') as string

    if (!user_id || !message) {
      return NextResponse.json(
        {
          error: 'Missing fields',
        },
        {
          status: 400,
        }
      )
    }

    const { error } =
      await adminDb
        .from('admin_messages')
        .insert({

          user_id,

          subject,

          message,

          sent_by: user.id,

          created_at:
            new Date().toISOString(),

        })

    if (error) {

      console.error(
        'MESSAGE ERROR:',
        error
      )

      return NextResponse.json(
        {
          error:
            error.message,
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.redirect(
      new URL(
        `/admin/messages/${user_id}`,
        req.url
      )
    )

  } catch (err: any) {

    console.error(
      'SEND MESSAGE ERROR:',
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