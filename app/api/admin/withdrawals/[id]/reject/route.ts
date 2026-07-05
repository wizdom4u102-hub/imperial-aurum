import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }   // ← Fixed
) {
  try {
    const supabase = await createClient()

    // ✅ Correct way to access params in Next.js 15+
    const { id: withdrawalId } = await params

    if (!withdrawalId) {
      return NextResponse.json(
        { error: 'Withdrawal ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('withdrawals')
      .update({
        status: 'rejected',
      })
      .eq('id', withdrawalId)

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to reject withdrawal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Withdrawal rejected successfully'
    })

  } catch (err: any) {
    console.error('Withdrawal rejection error:', err)
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}