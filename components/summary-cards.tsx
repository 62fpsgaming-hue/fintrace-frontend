'use client'

import { Users, AlertTriangle, CircleDot, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/lib/store'

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  accent: string
}

function MetricCard({ icon, label, value, accent }: MetricCardProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="flex items-center gap-4 py-0">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${accent}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function MetricCardSkeleton() {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="flex items-center gap-4 py-0">
        <Skeleton className="size-10 shrink-0 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="mb-2 h-3 w-24" />
          <Skeleton className="h-7 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}

export function SummaryCards() {
  const analysisData = useAppStore((s) => s.analysisData)
  const isLoading = useAppStore((s) => s.isLoading)

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!analysisData || !analysisData.summary) return null

  const { summary } = analysisData

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <MetricCard
        icon={<Users className="size-5 text-primary" />}
        label="Total Accounts"
        value={summary.total_accounts_analyzed?.toLocaleString() ?? '0'}
        accent="bg-primary/15"
      />
      <MetricCard
        icon={<AlertTriangle className="size-5 text-danger" />}
        label="Suspicious Flagged"
        value={summary.suspicious_accounts_flagged?.toLocaleString() ?? '0'}
        accent="bg-danger/15"
      />
      <MetricCard
        icon={<CircleDot className="size-5 text-forensic-ring" />}
        label="Fraud Rings"
        value={summary.fraud_rings_detected?.toLocaleString() ?? '0'}
        accent="bg-forensic-ring/15"
      />
      <MetricCard
        icon={<Clock className="size-5 text-success" />}
        label="Processing Time"
        value={`${summary.processing_time_seconds?.toFixed(2) ?? '0.00'}s`}
        accent="bg-success/15"
      />
    </div>
  )
}
