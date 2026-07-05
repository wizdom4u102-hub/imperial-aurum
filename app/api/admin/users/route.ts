export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { requireAdminApi } from '@/lib/admin'

const adminDb = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    console.log('================ USERS API ================')

    await requireAdminApi()

    console.log('✅ ADMIN VERIFIED')

    const { data: users, error } = await adminDb
      .from('profiles')
      .select(`
        id,
        email,
        status,
        created_at,
        verified,
        is_admin
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      users: users || [],
    })
  } catch (err: any) {
    console.error('USERS API ERROR:', err)

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}