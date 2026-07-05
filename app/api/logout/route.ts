import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.redirect(
    new URL('/login/admin', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
  )

  response.cookies.delete(
    'sb-uxddamerrgxzkluczmus-auth-token'
  )

  return response
}