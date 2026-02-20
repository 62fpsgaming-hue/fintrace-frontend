'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Save, Loader2, Check, Eye, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { updateUserSettings } from '@/lib/supabase/user-queries'
import type { UserSettings } from '@/lib/types'

interface SettingsTabProps {
  settings: UserSettings | null
}

export function SettingsTab({ settings }: SettingsTabProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [emailNotifications, setEmailNotifications] = useState(
    settings?.email_notifications ?? true
  )
  const [analysisNotifications, setAnalysisNotifications] = useState(
    settings?.analysis_notifications ?? true
  )
  const [autoSaveResults, setAutoSaveResults] = useState(
    settings?.auto_save_results ?? true
  )
  const [defaultView, setDefaultView] = useState(
    settings?.default_view ?? 'grid'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)

    try {
      await updateUserSettings({
        email_notifications: emailNotifications,
        analysis_notifications: analysisNotifications,
        auto_save_results: autoSaveResults,
        default_view: defaultView,
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      router.refresh()
    } catch (error) {
      console.error('Error updating settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Notifications */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-primary" />
              <CardTitle className="text-base">Notifications</CardTitle>
            </div>
            <CardDescription>
              Manage how you receive notifications and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-sm font-medium">
                  Email Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive email updates about your account and analyses
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="analysis-notifications" className="text-sm font-medium">
                  Analysis Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Get notified when analysis completes
                </p>
              </div>
              <Switch
                id="analysis-notifications"
                checked={analysisNotifications}
                onCheckedChange={setAnalysisNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Analysis Preferences */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="size-4 text-primary" />
              <CardTitle className="text-base">Analysis Preferences</CardTitle>
            </div>
            <CardDescription>
              Configure how analyses are saved and displayed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-save" className="text-sm font-medium">
                  Auto-save Results
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically save analysis results to your history
                </p>
              </div>
              <Switch
                id="auto-save"
                checked={autoSaveResults}
                onCheckedChange={setAutoSaveResults}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-view" className="text-sm font-medium">
                Default View
              </Label>
              <select
                id="default-view"
                value={defaultView}
                onChange={(e) => setDefaultView(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="grid">Grid View</option>
                <option value="list">List View</option>
                <option value="compact">Compact View</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Choose how analysis results are displayed by default
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center gap-3">
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
              <>
                <Save className="size-4" />
                Save Settings
              </>
            )}
          </Button>
          {success && (
            <span className="text-sm text-success">
              Settings updated successfully
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
