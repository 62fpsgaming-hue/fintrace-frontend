'use client'

import { useMemo } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/lib/store'

export function SuspiciousAccounts() {
  const analysisData = useAppStore((s) => s.analysisData)
  const isLoading = useAppStore((s) => s.isLoading)
  const setSelectedNode = useAppStore((s) => s.setSelectedNode)

  const top10 = useMemo(() => {
    if (!analysisData) return []
    return [...analysisData.suspicious_accounts]
      .sort((a, b) => b.suspicion_score - a.suspicion_score)
      .slice(0, 10)
  }, [analysisData])

  if (isLoading) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Suspicious Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysisData) return null

  return (
    <Card className="group relative overflow-hidden border-border bg-card shadow-lg transition-all hover:shadow-xl">
      {/* Gradient decoration */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-danger/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <CardHeader className="relative space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-danger/20 to-danger/10 shadow-lg">
            <AlertTriangle className="size-5 text-danger" />
          </div>
          <div>
            <CardTitle className="text-base">Suspicious Accounts Leaderboard</CardTitle>
            <CardDescription>
              Top 10 accounts by suspicion score
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <ScrollArea className="h-[400px]">
          <div className="flex flex-col gap-3">
            {top10.map((acct, idx) => {
              const scoreColor =
                acct.suspicion_score >= 80
                  ? 'text-danger'
                  : acct.suspicion_score >= 50
                    ? 'text-warning'
                    : 'text-primary'

              const progressClass =
                acct.suspicion_score >= 80
                  ? '[&>div]:bg-gradient-to-r [&>div]:from-danger [&>div]:to-danger/70'
                  : acct.suspicion_score >= 50
                    ? '[&>div]:bg-gradient-to-r [&>div]:from-warning [&>div]:to-warning/70'
                    : '[&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary/70'

              const bgGradient = 
                acct.suspicion_score >= 80
                  ? 'from-danger/10 to-danger/5 hover:from-danger/15 hover:to-danger/10'
                  : acct.suspicion_score >= 50
                    ? 'from-warning/10 to-warning/5 hover:from-warning/15 hover:to-warning/10'
                    : 'from-primary/10 to-primary/5 hover:from-primary/15 hover:to-primary/10'

              const rankBg = 
                idx === 0 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30' :
                idx === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-400/30' :
                idx === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white shadow-lg shadow-orange-600/30' :
                'bg-secondary text-muted-foreground'

              return (
                <button
                  key={acct.account_id}
                  type="button"
                  onClick={() =>
                    setSelectedNode({
                      id: acct.account_id,
                      label: acct.account_id,
                      isSuspicious: true,
                      suspicionScore: acct.suspicion_score,
                      detectedPatterns: acct.detected_patterns,
                      ringId: acct.ring_id,
                    })
                  }
                  className={`group/item relative flex flex-col gap-2 overflow-hidden rounded-xl border border-border bg-gradient-to-r p-4 text-left transition-all hover:scale-[1.02] hover:shadow-lg animate-fade-in ${bgGradient}`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Decorative corner */}
                  <div className={`absolute right-0 top-0 size-16 rounded-bl-full opacity-20 ${
                    acct.suspicion_score >= 80 ? 'bg-danger' :
                    acct.suspicion_score >= 50 ? 'bg-warning' : 'bg-primary'
                  }`} />
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`flex size-7 items-center justify-center rounded-lg text-xs font-bold transition-transform group-hover/item:scale-110 ${rankBg}`}>
                        {idx + 1}
                      </span>
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {acct.account_id}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-bold transition-transform group-hover/item:scale-110 ${scoreColor}`}>
                        {acct.suspicion_score}
                      </span>
                      <span className="text-xs text-muted-foreground">/100</span>
                    </div>
                  </div>
                  <Progress
                    value={acct.suspicion_score}
                    className={`h-2 shadow-sm ${progressClass}`}
                  />
                  <div className="flex flex-wrap items-center gap-1.5">
                    {acct.detected_patterns.map((p) => (
                      <Badge
                        key={p}
                        variant="outline"
                        className="border-border/50 bg-card/50 text-[10px] px-2 py-0.5 font-medium shadow-sm backdrop-blur-sm"
                      >
                        {p}
                      </Badge>
                    ))}
                    {acct.ring_id && (
                      <Badge className="bg-gradient-to-r from-forensic-ring/30 to-forensic-ring/20 text-forensic-ring border-forensic-ring/30 text-[10px] px-2 py-0.5 font-semibold shadow-sm">
                        Ring {acct.ring_id}
                      </Badge>
                    )}
                  </div>
                </button>
              )
            })}
            {top10.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-success/20 to-success/10 shadow-lg">
                  <AlertTriangle className="size-8 text-success" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">No suspicious accounts detected</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    All accounts are operating within normal parameters
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
