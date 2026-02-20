'use client'

import { useState, useMemo } from 'react'
import { ArrowUpDown, CircleDot } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/lib/store'
import type { FraudRing } from '@/lib/types'

type SortKey = 'ring_id' | 'pattern_type' | 'member_count' | 'risk_score'
type SortDir = 'asc' | 'desc'

export function RingsTable() {
  const analysisData = useAppStore((s) => s.analysisData)
  const isLoading = useAppStore((s) => s.isLoading)
  const setFilterRingId = useAppStore((s) => s.setFilterRingId)

  const [sortKey, setSortKey] = useState<SortKey>('risk_score')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sortedRings = useMemo(() => {
    if (!analysisData) return []
    return [...analysisData.fraud_rings].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      const mod = sortDir === 'asc' ? 1 : -1
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * mod
      }
      return ((aVal as number) - (bVal as number)) * mod
    })
  }, [analysisData, sortKey, sortDir])

  if (isLoading) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Fraud Rings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysisData) return null

  const SortButton = ({ label, keyName }: { label: string; keyName: SortKey }) => (
    <button
      type="button"
      onClick={() => handleSort(keyName)}
      className="inline-flex items-center gap-1 font-medium hover:text-foreground"
    >
      {label}
      <ArrowUpDown className="size-3" />
    </button>
  )

  return (
    <Card className="group relative overflow-hidden border-border bg-card shadow-lg transition-all hover:shadow-xl">
      {/* Gradient decoration */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-forensic-ring/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <CardHeader className="relative space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-forensic-ring/20 to-forensic-ring/10 shadow-lg">
            <CircleDot className="size-5 text-forensic-ring" />
          </div>
          <div>
            <CardTitle className="text-base">Fraud Ring Summary</CardTitle>
            <CardDescription>
              {analysisData.fraud_rings.length} ring{analysisData.fraud_rings.length !== 1 ? 's' : ''} detected. Click a ring to filter the graph.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <ScrollArea className="h-[320px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="font-semibold"><SortButton label="Ring ID" keyName="ring_id" /></TableHead>
                <TableHead className="font-semibold"><SortButton label="Pattern" keyName="pattern_type" /></TableHead>
                <TableHead className="text-right font-semibold"><SortButton label="Members" keyName="member_count" /></TableHead>
                <TableHead className="text-right font-semibold"><SortButton label="Risk Score" keyName="risk_score" /></TableHead>
                <TableHead className="font-semibold">Member Accounts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRings.map((ring: FraudRing, index) => {
                const isHighRisk = ring.risk_score > 80
                const isMediumRisk = ring.risk_score > 50 && ring.risk_score <= 80
                return (
                  <TableRow
                    key={ring.ring_id}
                    className={`group/row cursor-pointer transition-all animate-fade-in ${
                      isHighRisk 
                        ? 'bg-gradient-to-r from-danger/10 to-transparent hover:from-danger/20 hover:to-danger/5' 
                        : isMediumRisk
                        ? 'bg-gradient-to-r from-warning/10 to-transparent hover:from-warning/20 hover:to-warning/5'
                        : 'hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent'
                    }`}
                    style={{ animationDelay: `${index * 30}ms` }}
                    onClick={() => setFilterRingId(ring.ring_id)}
                  >
                    <TableCell className="font-mono font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <div className={`size-2 rounded-full ${
                          isHighRisk ? 'bg-danger shadow-lg shadow-danger/50' : 
                          isMediumRisk ? 'bg-warning shadow-lg shadow-warning/50' : 
                          'bg-success shadow-lg shadow-success/50'
                        }`} />
                        {ring.ring_id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-medium shadow-sm ${
                          isHighRisk ? 'border-danger/30 bg-danger/10 text-danger' :
                          isMediumRisk ? 'border-warning/30 bg-warning/10 text-warning' :
                          'border-forensic-ring/30 bg-forensic-ring/10 text-forensic-ring'
                        }`}
                      >
                        {ring.pattern_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono font-semibold text-foreground">
                        {ring.member_count}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className={`text-lg font-bold transition-transform group-hover/row:scale-110 ${
                            ring.risk_score > 80
                              ? 'text-danger'
                              : ring.risk_score > 50
                                ? 'text-warning'
                                : 'text-success'
                          }`}
                        >
                          {ring.risk_score}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-[200px] truncate font-mono text-xs text-muted-foreground">
                        {ring.member_accounts.join(', ')}
                      </p>
                    </TableCell>
                  </TableRow>
                )
              })}
              {sortedRings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-success/10">
                        <CircleDot className="size-6 text-success" />
                      </div>
                      <p className="text-sm font-medium text-foreground">No fraud rings detected</p>
                      <p className="text-xs text-muted-foreground">All accounts appear to be operating normally</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
