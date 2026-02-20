'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Building2, Briefcase, Loader2, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { updateUserProfile } from '@/lib/supabase/user-queries'
import type { UserProfile } from '@/lib/types'

interface ProfileTabProps {
  user: { email: string; id: string }
  profile: UserProfile | null
}

export function ProfileTab({ user, profile }: ProfileTabProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [organization, setOrganization] = useState(profile?.organization || '')
  const [role, setRole] = useState(profile?.role || 'analyst')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)

    try {
      await updateUserProfile({
        full_name: fullName,
        organization: organization || null,
        role,
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      router.refresh()
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const initials = fullName
    ? fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email[0].toUpperCase()

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Avatar className="size-20 border-2 border-primary/20">
              <AvatarImage src={profile?.avatar_url || undefined} alt={fullName} />
              <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-foreground">
                {fullName || 'User'}
              </h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {organization && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {organization}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2">
              <Briefcase className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium capitalize text-foreground">
                {role.replace('_', ' ')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and professional details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if you need to update it.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization" className="text-sm font-medium">
                Organization
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="organization"
                  type="text"
                  placeholder="ACME Corporation"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                Role
              </Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="analyst">Analyst</option>
                <option value="senior_analyst">Senior Analyst</option>
                <option value="manager">Manager</option>
                <option value="director">Director</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : success ? (
                  <>
                    <Check className="size-4" />
                    Saved!
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              {success && (
                <span className="text-sm text-success">
                  Profile updated successfully
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Account Information</CardTitle>
          <CardDescription>
            Your account details and membership information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">User ID</span>
            <span className="font-mono text-sm text-foreground">{user.id.slice(0, 8)}...</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Member Since</span>
            <span className="text-sm text-foreground">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Last Updated</span>
            <span className="text-sm text-foreground">
              {profile?.updated_at
                ? new Date(profile.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'N/A'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
