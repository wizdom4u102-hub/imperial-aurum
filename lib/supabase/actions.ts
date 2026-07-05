// lib/supabase/actions.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'     // ← Add this line

export async function createActionClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          console.log('WRITING COOKIES:', cookiesToSet.map(c => c.name))
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (e) {
            console.warn('Cookie set error in action:', e)
          }
        },
      },
    }
  )
}