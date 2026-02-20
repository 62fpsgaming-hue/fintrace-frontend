'use client'

import { Users, AlertTriangle, CircleDot, Clock, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/lib/store'

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  accent: string
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    value: string
    label: string
  }
  context?: {
    label: string
    value: string
  }
  benchmark?: {
    label: string
    value: string
    status: 'good' | 'warning' | 'danger'
  }
}

function MetricCard({ icon, label, value, accent, trend, context, benchmark }: MetricCardProps) {
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus
  
  return (
    <Card className="group relative overflow-hidden border-border/50 bg-gradient-to-br from-card via-card to-secondary/20 shadow-lg transition-all hover:shadow-xl hover:border-primary/30">
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
      
      <CardContent className="relative py-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl shadow-lg ${accent} transition-all group-hover:scale-110 group-hover:shadow-xl`}>
              {icon}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/90">{label}</p>
              <p className="text-2xl font-black tracking-tight text-foreground">{value}</p>
            </div>
          </div>
          {trend && (
            <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 shadow-md ${
              trend.direction === 'up' ? 'bg-gradient-to-br from-red-500/20 to-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/30' :
              trend.direction === 'down' ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30' :
              'bg-gradient-to-br from-secondary to-secondary/50 text-muted-foreground'
            }`}>
              <TrendIcon className="size-3.5" />
              <span className="text-xs font-bold">{trend.value}</span>
            </div>
          )}
        </div>
        
        {(context || benchmark) && (
          <div className="mt-4 space-y-2 border-t border-border/60 pt-3.5">
            {context && (
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">{context.label}</span>
                <span className="font-mono font-bold text-foreground">{context.value}</span>
              </div>
            )}
            {benchmark && (
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">{benchmark.label}</span>
                <Badge 
                  variant={benchmark.status === 'good' ? 'secondary' : benchmark.status === 'warning' ? 'default' : 'destructive'}
                  className={`h-5 text-[10px] font-bold shadow-sm ${
                    benchmark.status === 'good' ? 'text-foreground' : 
                    benchmark.status === 'warning' ? 'text-primary-foreground' : 
                    'text-white'
                  }`}
                >
                  {benchmark.value}
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MetricCardSkeleton() {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="py-4">
        <div className="flex items-center gap-4">
          <Skeleton className="size-11 shrink-0 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="mb-2 h-3 w-24" />
            <Skeleton className="h-7 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function EnhancedSummaryCards() {
  const analysisData = useAppStore((s) => s.analysisData)
  const isLoading = useAppStore((s) => s.isLoading)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!analysisData || !analysisData.summary) return null

  const { summary } = analysisData

  // Calculate metrics
  const suspiciousRate = ((summary.suspicious_accounts_flagged / summary.total_accounts_analyzed) * 100).toFixed(2)
  const edgeCount = analysisData.fraud_rings.reduce((sum, ring) => sum + ring.member_accounts.length, 0)
  const graphDensity = ((edgeCount / Math.max(summary.total_accounts_analyzed, 1)) * 100).toFixed(2)
  
  // Industry benchmarks (mock data - would come from backend)
  const industryAvgSuspiciousRate = 2.8
  const suspiciousRateStatus = parseFloat(suspiciousRate) > industryAvgSuspiciousRate * 1.5 ? 'danger' : 
                                parseFloat(suspiciousRate) > industryAvgSuspiciousRate ? 'warning' : 'good'

  return (
    <div className="space-y-4">
      {/* Performance Metrics Bar */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent shadow-lg">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/20 shadow-md">
                <BarChart3 className="size-5 text-primary" />
              </div>
              <span className="text-sm font-bold text-foreground">Analysis Performance</span>
            </div>
            <div className="flex items-center gap-8 text-xs">
              <div>
                <span className="font-medium text-muted-foreground">Graph Size: </span>
                <span className="font-mono font-bold text-foreground">{summary.total_accounts_analyzed} nodes</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Edge Density: </span>
                <span className="font-mono font-bold text-foreground">{graphDensity}%</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Processing: </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{summary.processing_time_seconds.toFixed(2)}s</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Users className="size-6 text-blue-600 dark:text-blue-400" />}
          label="Total Accounts"
          value={summary.total_accounts_analyzed?.toLocaleString() ?? '0'}
          accent="bg-gradient-to-br from-blue-500/25 via-blue-500/15 to-blue-500/10 ring-1 ring-blue-500/20"
          context={{
            label: 'Graph Nodes',
            value: `${summary.total_accounts_analyzed} analyzed`,
          }}
        />
        
        <MetricCard
          icon={<AlertTriangle className="size-6 text-red-600 dark:text-red-400" />}
          label="Suspicious Flagged"
          value={summary.suspicious_accounts_flagged?.toLocaleString() ?? '0'}
          accent="bg-gradient-to-br from-red-500/25 via-red-500/15 to-red-500/10 ring-1 ring-red-500/20"
          trend={{
            direction: parseFloat(suspiciousRate) > industryAvgSuspiciousRate ? 'up' : 'down',
            value: `${suspiciousRate}%`,
            label: 'of total',
          }}
          benchmark={{
            label: 'vs Industry Avg',
            value: parseFloat(suspiciousRate) > industryAvgSuspiciousRate 
              ? `+${(parseFloat(suspiciousRate) - industryAvgSuspiciousRate).toFixed(1)}%` 
              : `${(parseFloat(suspiciousRate) - industryAvgSuspiciousRate).toFixed(1)}%`,
            status: suspiciousRateStatus,
          }}
        />
        
        <MetricCard
          icon={<CircleDot className="size-6 text-purple-600 dark:text-purple-400" />}
          label="Fraud Rings"
          value={summary.fraud_rings_detected?.toLocaleString() ?? '0'}
          accent="bg-gradient-to-br from-purple-500/25 via-purple-500/15 to-purple-500/10 ring-1 ring-purple-500/20"
          context={{
            label: 'Ring Density',
            value: `${((summary.fraud_rings_detected / Math.max(summary.total_accounts_analyzed, 1)) * 100).toFixed(2)}%`,
          }}
          benchmark={{
            label: 'Risk Level',
            value: summary.fraud_rings_detected > 5 ? 'High' : summary.fraud_rings_detected > 2 ? 'Medium' : 'Low',
            status: summary.fraud_rings_detected > 5 ? 'danger' : summary.fraud_rings_detected > 2 ? 'warning' : 'good',
          }}
        />
        
        <MetricCard
          icon={<Clock className="size-6 text-emerald-600 dark:text-emerald-400" />}
          label="Processing Time"
          value={`${summary.processing_time_seconds?.toFixed(2) ?? '0.00'}s`}
          accent="bg-gradient-to-br from-emerald-500/25 via-emerald-500/15 to-emerald-500/10 ring-1 ring-emerald-500/20"
          trend={{
            direction: summary.processing_time_seconds < 1 ? 'down' : 'neutral',
            value: summary.processing_time_seconds < 1 ? 'Fast' : 'Normal',
            label: 'performance',
          }}
          context={{
            label: 'Throughput',
            value: `${Math.round(summary.total_accounts_analyzed / summary.processing_time_seconds)}/s`,
          }}
        />
      </div>

      {/* Context Banner */}
      <Card className="border-border bg-gradient-to-br from-secondary/30 to-transparent shadow-sm">
        <CardContent className="py-3">
          <div className="flex items-start gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="size-4 text-primary" />
            </div>
            <div className="flex-1 text-sm">
              <p className="font-medium text-foreground">Analysis Context</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Your suspicious account rate of <span className="font-semibold text-foreground">{suspiciousRate}%</span> is{' '}
                {parseFloat(suspiciousRate) > industryAvgSuspiciousRate ? (
                  <>
                    <span className="font-semibold text-danger">
                      {((parseFloat(suspiciousRate) / industryAvgSuspiciousRate - 1) * 100).toFixed(0)}% higher
                    </span>{' '}
                    than the industry baseline of {industryAvgSuspiciousRate}%. This elevated rate warrants immediate investigation.
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-success">within normal range</span> compared to the industry baseline 
                    of {industryAvgSuspiciousRate}%. Continue standard monitoring protocols.
                  </>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
