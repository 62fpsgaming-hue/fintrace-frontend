import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile, getUserSettings } from '@/lib/supabase/user-queries'
import { ProfileShell } from '@/components/profile/profile-shell'

export default async function ProfilePage() {
  const supabase = await createClient()

  if (!supabase) {
    redirect('/dashboard')
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const [profile, settings] = await Promise.all([
    getUserProfile(),
    getUserSettings(),
  ])

  return (
    <ProfileShell
      user={{ email: user.email ?? '', id: user.id }}
      profile={profile}
      settings={settings}
    />
  )
}
