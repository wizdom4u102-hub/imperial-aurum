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

    const userIds = [
  ...new Set(
    (withdrawals ?? [])
      .map(
        (withdrawal) =>
          withdrawal.user_id
      )
      .filter(
        (
          userId
        ): userId is string =>
          typeof userId === 'string'
      )
  ),
]

const {
  data: profiles,
  error: profilesError,
} =
  userIds.length > 0
    ? await supabaseAdmin
        .from('profiles')
        .select(
          'id, username, email'
        )
        .in(
          'id',
          userIds
        )
    : {
        data: [],
        error: null,
      }

if (profilesError) {

  console.error(
    'WITHDRAWAL PROFILES FETCH ERROR:',
    profilesError
  )

  return NextResponse.json(
    {
      error:
        profilesError.message
    },
    {
      status: 500
    }
  )

}

const profileMap =
  new Map(
    (profiles ?? []).map(
      (profile) => [
        profile.id,
        profile,
      ]
    )
  )

const withdrawalsWithUsers =
  (withdrawals ?? []).map(
    (withdrawal) => {

      const profile =
        profileMap.get(
          withdrawal.user_id ?? ''
        )

      return {
        ...withdrawal,

        username:
          profile?.username ?? null,

        email:
          profile?.email ?? null,
      }

    }
  )

    // =====================================================
    // SUCCESS
    // =====================================================

   return NextResponse.json({

  success: true,

  withdrawals:
    withdrawalsWithUsers

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