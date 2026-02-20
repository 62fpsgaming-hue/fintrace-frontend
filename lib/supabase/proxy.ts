import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('[Middleware] Path:', request.nextUrl.pathname)
  console.log('[Middleware] Supabase configured:', !!supabaseUrl && !!supabaseKey)

  // If Supabase is not configured, allow access without auth
  if (!supabaseUrl || !supabaseKey) {
    console.log('[Middleware] No Supabase config, allowing access')
    return NextResponse.next({
      request,
    })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('[Middleware] User:', user?.email || 'not logged in')

  // Protect dashboard and profile routes
  if (!user && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/profile'))) {
    console.log('[Middleware] Redirecting to login - no user')
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (user && request.nextUrl.pathname.startsWith('/auth/') && !request.nextUrl.pathname.startsWith('/auth/callback')) {
    console.log('[Middleware] Redirecting to dashboard - user already logged in')
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  console.log('[Middleware] Allowing access')
  return supabaseResponse
}
