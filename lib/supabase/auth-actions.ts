'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(email: string, password: string) {
  const supabase = await createClient()

  if (!supabase) {
    // Auth not configured, redirect to dashboard
    redirect('/dashboard')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(email: string, password: string, fullName: string) {
  const supabase = await createClient()

  if (!supabase) {
    // Auth not configured, redirect to dashboard
    redirect('/dashboard')
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
    return { error: error.message }
  }

  redirect('/auth/sign-up-success')
}

export async function signOut() {
  const supabase = await createClient()

  if (!supabase) {
    redirect('/')
  }

  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
