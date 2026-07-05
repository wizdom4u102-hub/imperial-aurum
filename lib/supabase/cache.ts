// lib/supabase/cache.ts
import { User } from '@supabase/supabase-js'

const requestCache = new Map<string, { user: User | null; timestamp: number }>()

export function getCachedUser(requestId: string) {
  const cached = requestCache.get(requestId)
  if (cached && Date.now() - cached.timestamp < 5000) { // 5 seconds cache
    return cached.user
  }
  return null
}

export function setCachedUser(requestId: string, user: User | null) {
  requestCache.set(requestId, { user, timestamp: Date.now() })
  // Clean old entries
  if (requestCache.size > 50) {
    const oldest = [...requestCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)[0]
    if (oldest) requestCache.delete(oldest[0])
  }
}