export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {

  try {

    const supabase =
      await createClient()

    const {
      data:{ user }
    } =
    await supabase.auth.getUser()

    if(!user){

      return NextResponse.json(
        {
          error:'Unauthorized'
        },
        {
          status:401
        }
      )

    }

    const {
      data:balance,
      error
    } =
    await supabase
      .from('balances')
      .select('*')
      .eq(
        'user_id',
        user.id
      )
      .single()

    if(error){

      return NextResponse.json(
        {
          error:error.message
        },
        {
          status:500
        }
      )

    }

    return NextResponse.json({

      success:true,

      gold:
        Number(
          balance?.gold || 0
        ),

      cash:
        Number(
          balance?.cash || 0
        ),

      shares:
        Number(
          balance?.shares || 0
        ),

      mining_rate_per_hour:5

    })

  }catch(err:any){

    return NextResponse.json(
      {
        error:err.message
      },
      {
        status:500
      }
    )

  }

}