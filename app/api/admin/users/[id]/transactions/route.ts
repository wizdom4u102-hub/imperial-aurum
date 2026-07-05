import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// ✅ admin client
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

    // ✅ admin check
    if (!user || user.email !== 'admin@imperialaurum.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // ✅ FETCH TRANSACTIONS
    const { data, error } = await adminDb
      .from('transactions') // ⚠️ MUST EXIST IN DB
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Transactions fetch error:', error)
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(
  Array.isArray(data) ? data : []
)

  } catch (err) {
    console.error('❌ Transactions API error:', err)
    return NextResponse.json([], { status: 500 })
  }
}