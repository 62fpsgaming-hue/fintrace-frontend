'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Activity, TrendingUp, Clock, Target } from 'lucide-react'
import { AnalysisHistoryTable } from './analysis-history-table'
import { AnalysisChart } from './analysis-chart'
import { UserStatsCards } from './user-stats-cards'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AnalysisHistoryRecord } from '@/lib/types'
import { useAppStore } from '@/lib/store'

interface UserDashboardProps {
  history: AnalysisHistoryRecord[]
  stats: {
    totalAnalyses: number
    totalSuspicious: number
    totalRings: number
    avgProcessingTime: number
  }
}

export function UserDashboard({ history, stats }: UserDashboardProps) {
  const router = useRouter()
  const setAnalysisData = useAppStore((s) => s.setAnalysisData)
  const [activeTab, setActiveTab] = useState('analyze')

  const handleViewAnalysis = (record: AnalysisHistoryRecord) => {
    // Load the stored analysis data into the global store, then navigate
    setAnalysisData(record.analysis_data)
    setActiveTab('analyze')
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Calculate insights
  const recentAnalyses = history.slice(0, 5)
  const avgSuspiciousRate = history.length > 0
    ? (history.reduce((sum, h) => sum + h.suspicious_accounts, 0) / history.reduce((sum, h) => sum + h.total_accounts, 0) * 100).toFixed(1)
    : '0.0'
  const avgRingsPerAnalysis = history.length > 0
    ? (stats.totalRings / stats.totalAnalyses).toFixed(1)
    : '0.0'

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome section with enhanced gradient */}
      <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-card to-forensic-ring/10 p-6 shadow-lg transition-all hover:shadow-xl md:p-8">
        {/* Animated background decoration */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute right-0 top-0 size-64 rounded-full bg-primary/20 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 size-64 rounded-full bg-forensic-ring/20 blur-3xl animate-pulse-slow [animation-delay:1.5s]" />
        </div>
        
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Welcome back! 👋
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Here's an overview of your fraud detection activity. You've analyzed{' '}
              <span className="font-semibold text-primary">{stats.totalAnalyses.toLocaleString()}</span> datasets
              and detected{' '}
              <span className="font-semibold text-danger">{stats.totalRings.toLocaleString()}</span> fraud rings.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-success/20 to-success/10 shadow-lg">
              <TrendingUp className="size-6 text-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats overview */}
      <UserStatsCards
        totalAnalyses={stats.totalAnalyses}
        totalSuspicious={stats.totalSuspicious}
        totalRings={stats.totalRings}
        avgProcessingTime={stats.avgProcessingTime}
      />

      {/* Quick insights with enhanced cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="group relative overflow-hidden border-border bg-gradient-to-br from-card to-primary/5 shadow-sm transition-all hover:shadow-lg">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader className="relative pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <Activity className="size-4 text-primary" />
              </div>
              Suspicious Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold tracking-tight text-foreground">{avgSuspiciousRate}%</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Average across all analyses
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-border bg-gradient-to-br from-card to-forensic-ring/5 shadow-sm transition-all hover:shadow-lg">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-forensic-ring/10 opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader className="relative pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <div className="flex size-8 items-center justify-center rounded-lg bg-forensic-ring/10">
                <Target className="size-4 text-forensic-ring" />
              </div>
              Rings per Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold tracking-tight text-foreground">{avgRingsPerAnalysis}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Average fraud rings detected
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-border bg-gradient-to-br from-card to-success/5 shadow-sm transition-all hover:shadow-lg sm:col-span-2 lg:col-span-1">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-success/10 opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader className="relative pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <div className="flex size-8 items-center justify-center rounded-lg bg-success/10">
                <Clock className="size-4 text-success" />
              </div>
              Processing Speed
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {(stats.avgProcessingTime / 1000).toFixed(1)}s
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Average analysis time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <AnalysisChart history={history} />

      {/* History table */}
      <AnalysisHistoryTable
        history={history}
        onView={handleViewAnalysis}
      />
    </div>
  )
}
