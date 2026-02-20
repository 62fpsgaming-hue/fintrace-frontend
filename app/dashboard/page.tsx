import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAnalysisHistory, getAnalysisStats } from '@/lib/supabase/queries'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export default async function DashboardPage() {
  const supabase = await createClient()

  // If Supabase is not configured, allow guest access
  if (!supabase) {
    return (
      <DashboardShell
        user={null}
        history={[]}
        stats={{ totalAnalyses: 0, totalSuspicious: 0, totalRings: 0, avgProcessingTime: 0 }}
      />
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow guest access - no redirect to login
  if (!user) {
    return (
      <DashboardShell
        user={null}
        history={[]}
        stats={{ totalAnalyses: 0, totalSuspicious: 0, totalRings: 0, avgProcessingTime: 0 }}
      />
    )
  }

  const [history, stats] = await Promise.all([
    getAnalysisHistory(),
    getAnalysisStats(),
  ])

  return (
    <DashboardShell
      user={{ email: user.email ?? '', id: user.id }}
      history={history}
      stats={stats}
    />
  )
}
