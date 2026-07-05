export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { requireAdminApi  } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {

  try {

    console.log(
      '=========== ADMIN WITHDRAWALS API =========='
    )

    // =====================================================
    // ADMIN AUTH
    // =====================================================

    const admin =
      await requireAdminApi()

    if (!admin.ok) {

      console.error(
        'ADMIN AUTH FAILED:',
        admin.error
      )

      return NextResponse.json(
        {
          error:
            admin.error
        },
        {
          status:
            admin.status
        }
      )

    }

    // =====================================================
    // FETCH WITHDRAWALS
    // =====================================================

    const {
      data: withdrawals,
      error
    } =
      await supabaseAdmin
        .from('withdrawals')
        .select('*')
        .order(
          'created_at',
          {
            ascending: false
          }
        )

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

      console.error(
        'WITHDRAWALS FETCH ERROR:',
        error
      )

      return NextResponse.json(
        {
          error:
            error.message
        },
        {
          status: 500
        }
      )

    }

    console.log(
      'TOTAL WITHDRAWALS:',
      withdrawals?.length || 0
    )

    console.log(
      'WITHDRAWALS:',
      withdrawals
    )

    // =====================================================
    // SUCCESS
    // =====================================================

    return NextResponse.json({

      success: true,

      withdrawals:
        withdrawals || []

    })

  } catch (err: any) {

    console.error(
      'ADMIN WITHDRAWALS API ERROR:',
      err
    )

    return NextResponse.json(
      {
        error:
          err.message ||
          'Server error'
      },
      {
        status: 500
      }
    )

  }

}