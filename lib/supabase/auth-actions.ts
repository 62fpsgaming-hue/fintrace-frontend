'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function login(email: string, password: string) {
  const supabase = await createClient()

  if (!supabase) {
    // Auth not configured
    return { success: true, redirectTo: '/dashboard' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true, redirectTo: '/dashboard' }
}

export async function guestLogin() {
  // Guest login bypasses authentication
  // Just redirect to dashboard - middleware will allow access
  revalidatePath('/', 'layout')
  return { success: true, redirectTo: '/dashboard', isGuest: true }
}

export async function signup(email: string, password: string, fullName: string) {
  const supabase = await createClient()

  if (!supabase) {
    // Auth not configured
    return { success: true, redirectTo: '/dashboard' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, redirectTo: '/auth/sign-up-success' }
}

export async function signOut() {
  const supabase = await createClient()

  if (!supabase) {
    return { success: true, redirectTo: '/' }
  }

  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  return { success: true, redirectTo: '/' }
}
