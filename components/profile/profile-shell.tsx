'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Shield,
  User,
  Settings,
  Activity,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileTab } from './profile-tab'
import { SettingsTab } from './settings-tab'
import { ActivityTab } from './activity-tab'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile, UserSettings } from '@/lib/types'

interface ProfileShellProps {
  user: { email: string; id: string }
  profile: UserProfile | null
  settings: UserSettings | null
}

export function ProfileShell({ user, profile, settings }: ProfileShellProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      const supabase = createClient()
      if (supabase) {
        await supabase.auth.signOut()
      }
    } catch {
      // Ignore errors
    }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-lg md:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-secondary hover:text-foreground hover:shadow-sm"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
              <Shield className="size-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-foreground">
                User Profile
              </h1>
              <p className="text-[11px] leading-none text-muted-foreground">
                Manage your account settings
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 shadow-sm sm:flex">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary/10">
              <User className="size-3.5 text-primary" />
            </div>
            <span className="max-w-[180px] truncate text-xs font-medium text-foreground">
              {user.email}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={signingOut}
            className="gap-1.5 text-muted-foreground transition-all hover:text-foreground"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">{signingOut ? 'Signing out...' : 'Sign Out'}</span>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 md:px-6">
        <div className="mx-auto max-w-5xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="profile" className="gap-2">
                <User className="size-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="size-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-2">
                <Activity className="size-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <ProfileTab user={user} profile={profile} />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <SettingsTab settings={settings} />
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <ActivityTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
