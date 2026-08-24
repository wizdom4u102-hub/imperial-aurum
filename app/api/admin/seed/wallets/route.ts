import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { requireAdminApi } from '@/lib/admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function GET() {
  const admin = await requireAdminApi()

  if (!admin.ok) {
    return NextResponse.json(
      { error: admin.error },
      { status: admin.status }
    )
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      'ADMIN SEED ERROR: Supabase service-role configuration is missing'
    )

    return NextResponse.json(
      {
        error:
          'Admin database configuration unavailable',
      },
      { status: 500 }
    )
  }

  const supabase = createAdminClient(
    supabaseUrl,
    serviceRoleKey
  )

  const {
    data: wallets,
    error: walletsError,
  } = await supabase
    .from('wallets')
    .select(
      'id, user_id, address, network, created_at'
    )
    .order('created_at', {
      ascending: false,
    })

  if (walletsError) {
    console.error(
      'ADMIN SEED WALLETS LOAD ERROR:',
      walletsError
    )

    return NextResponse.json(
      {
        error: 'Failed to load wallets',
      },
      { status: 500 }
    )
  }

  const userIds = [
    ...new Set(
      (wallets ?? [])
        .map((wallet) => wallet.user_id)
        .filter(
          (userId): userId is string =>
            typeof userId === 'string' &&
            userId.length > 0
        )
    ),
  ]

  const profiles =
    userIds.length > 0
      ? await supabase
          .from('profiles')
          .select(
            'id, name, email'
          )
          .in('id', userIds)
      : {
          data: [],
          error: null,
        }

  if (profiles.error) {
    console.error(
      'ADMIN SEED PROFILE LOAD ERROR:',
      profiles.error
    )

    return NextResponse.json(
      {
        error:
          'Failed to load wallet owners',
      },
      { status: 500 }
    )
  }

  const profileMap = new Map(
    (profiles.data ?? []).map(
      (profile) => [
        profile.id,
        {
          name: profile.name,
          email: profile.email,
        },
      ]
    )
  )

  const result = (wallets ?? []).map(
    (wallet) => {
      const profile =
        profileMap.get(wallet.user_id)

      return {
        id: wallet.id,
        user_id: wallet.user_id,
        name:
          profile?.name ?? 'Unknown User',
        email:
          profile?.email ?? 'No email',
        address:
          wallet.address,
        network:
          wallet.network,
        created_at:
          wallet.created_at,
      }
    }
  )

  return NextResponse.json(
    {
      wallets: result,
    },
    {
      status: 200,
      headers: {
        'Cache-Control':
          'no-store',
      },
    }
  )
}