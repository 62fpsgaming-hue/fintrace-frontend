'use client'

import { useEffect, useState } from 'react'
import { Activity, FileText, Settings, Star, Tag, Trash2, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { getRecentActivity } from '@/lib/supabase/user-queries'
import type { ActivityLogEntry } from '@/lib/types'

const actionIcons: Record<string, any> = {
  analysis_created: FileText,
  analysis_deleted: Trash2,
  analysis_favorited: Star,
  analysis_unfavorited: Star,
  analysis_tags_updated: Tag,
  analysis_notes_updated: FileText,
  profile_updated: Settings,
  settings_updated: Settings,
  filter_created: Tag,
  filter_deleted: Trash2,
}

const actionLabels: Record<string, string> = {
  analysis_created: 'Created analysis',
  analysis_deleted: 'Deleted analysis',
  analysis_favorited: 'Favorited analysis',
  analysis_unfavorited: 'Unfavorited analysis',
  analysis_tags_updated: 'Updated tags',
  analysis_notes_updated: 'Updated notes',
  profile_updated: 'Updated profile',
  settings_updated: 'Updated settings',
  filter_created: 'Created filter',
  filter_deleted: 'Deleted filter',
}

export function ActivityTab() {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadActivity() {
      setIsLoading(true)
      const data = await getRecentActivity(50)
      setActivities(data)
      setIsLoading(false)
    }
    loadActivity()
  }, [])

  if (isLoading) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-primary" />
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </div>
        <CardDescription>
          Your recent actions and activity history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="mb-4 size-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No activity yet. Start analyzing transactions to see your activity here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => {
                const Icon = actionIcons[activity.action] || Activity
                const label = actionLabels[activity.action] || activity.action
                const date = new Date(activity.created_at)
                const timeAgo = getTimeAgo(date)

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {label}
                      </p>
                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {JSON.stringify(activity.metadata).slice(0, 100)}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        <span>{timeAgo}</span>
                        <span>•</span>
                        <span>{date.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return `${Math.floor(seconds / 604800)}w ago`
}
