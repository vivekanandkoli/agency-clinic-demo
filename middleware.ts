import { type NextRequest, NextResponse } from 'next/server'
import { getAdminConfigError, isAdminUser } from '@/lib/auth/admin'
import { updateSession } from '@/lib/supabase/middleware'

const ADMIN_LOGIN = '/admin/login'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminPage = pathname.startsWith('/admin')
  const isAdminApi = pathname.startsWith('/api/admin')
  const isPublicSetup = pathname === '/api/setup'
  const isLoginPage = pathname === ADMIN_LOGIN

  // Refresh Supabase session on every matched request
  const { supabaseResponse, user } = await updateSession(request)

  if (isPublicSetup) {
    return supabaseResponse
  }

  if (!isAdminPage && !isAdminApi) {
    return supabaseResponse
  }

  const configError = getAdminConfigError()
  if (configError && isAdminApi) {
    return NextResponse.json({ error: configError }, { status: 503 })
  }

  const isAdmin = isAdminUser(user)

  if (isAdminApi) {
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return supabaseResponse
  }

  if (isLoginPage) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return supabaseResponse
  }

  if (!user) {
    const loginUrl = new URL(ADMIN_LOGIN, request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (!isAdmin) {
    const loginUrl = new URL(ADMIN_LOGIN, request.url)
    loginUrl.searchParams.set('error', 'forbidden')
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets.
     * Keeps Supabase auth sessions refreshed (official Next.js pattern).
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|ico)$).*)',
  ],
}
