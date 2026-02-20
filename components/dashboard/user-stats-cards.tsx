import { FileText, AlertTriangle, CircleDot, Clock, TrendingUp, Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface UserStatsCardsProps {
  totalAnalyses: number
  totalSuspicious: number
  totalRings: number
  avgProcessingTime: number
}

export function UserStatsCards({
  totalAnalyses,
  totalSuspicious,
  totalRings,
  avgProcessingTime,
}: UserStatsCardsProps) {
  const stats = [
    {
      icon: FileText,
      label: 'Total Analyses',
      value: totalAnalyses.toLocaleString(),
      color: 'primary',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
      trend: null,
    },
    {
      icon: AlertTriangle,
      label: 'Suspicious Accounts',
      value: totalSuspicious.toLocaleString(),
      color: 'danger',
      bgColor: 'bg-danger/10',
      iconColor: 'text-danger',
      trend: null,
    },
    {
      icon: CircleDot,
      label: 'Fraud Rings',
      value: totalRings.toLocaleString(),
      color: 'forensic-ring',
      bgColor: 'bg-forensic-ring/10',
      iconColor: 'text-forensic-ring',
      trend: null,
    },
    {
      icon: Clock,
      label: 'Avg Processing Time',
      value: `${avgProcessingTime}ms`,
      color: 'success',
      bgColor: 'bg-success/10',
      iconColor: 'text-success',
      trend: null,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.label}
          className="group relative overflow-hidden border-border bg-card shadow-sm transition-all hover:shadow-xl animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Gradient overlay on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
          
          {/* Decorative corner accent */}
          <div className={`absolute right-0 top-0 size-20 rounded-bl-full ${stat.bgColor} opacity-10 transition-all group-hover:scale-150`} />
          
          <CardContent className="relative flex items-center gap-4 p-5 md:p-6">
            <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${stat.bgColor} shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl md:size-14`}>
              <stat.icon className={`size-6 ${stat.iconColor} md:size-7`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground md:text-xs">
                {stat.label}
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <p className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {stat.value}
                </p>
                {stat.trend && (
                  <span className="flex items-center gap-0.5 text-xs font-medium text-success">
                    <TrendingUp className="size-3" />
                    {stat.trend}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

