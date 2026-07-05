import { createClient } from '@/lib/supabase/server'

export async function settleMining(
  userId: string
) {
  const supabase =
    await createClient()

  const {
    data: session,
    error,
  } =
    await supabase
      .from('mining_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .maybeSingle()

  if (
    error ||
    !session
  ) {
    return
  }

  const now =
    Date.now()

  const endTime =
    new Date(
      session.ends_at
    ).getTime()

  if (
    now < endTime
  ) {
    return
  }

  await supabase
    .from('mining_sessions')
    .update({
      active: false,
      status: 'completed',
    })
    .eq(
      'id',
      session.id
    )
}