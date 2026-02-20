'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'
import type { AnalysisHistoryRecord } from '@/lib/types'
import { TrendingUp } from 'lucide-react'

interface AnalysisChartProps {
  history: AnalysisHistoryRecord[]
}

const COLORS = [
  'oklch(0.50 0.18 260)',  // primary
  'oklch(0.58 0.22 25)',   // danger
  'oklch(0.55 0.18 310)',  // forensic-ring
  'oklch(0.55 0.14 160)',  // success
  'oklch(0.70 0.16 70)',   // warning
]

export function AnalysisChart({ history }: AnalysisChartProps) {
  if (history.length === 0) return null

  // Prepare bar chart data: last 10 analyses reversed for chronological order
  const recentHistory = [...history].slice(0, 10).reverse()
  const barData = recentHistory.map((record, index) => ({
    name: `#${index + 1}`,
    fileName: record.file_name.length > 20
      ? record.file_name.slice(0, 17) + '...'
      : record.file_name,
    accounts: record.total_accounts,
    suspicious: record.suspicious_accounts,
    rings: record.fraud_rings_detected,
  }))

  // Prepare pie chart data: aggregate pattern types
  const suspiciousTotal = history.reduce((s, r) => s + r.suspicious_accounts, 0)
  const cleanTotal = history.reduce((s, r) => s + r.total_accounts - r.suspicious_accounts, 0)
  const ringsTotal = history.reduce((s, r) => s + r.fraud_rings_detected, 0)
  const pieData = [
    { name: 'Clean Accounts', value: cleanTotal },
    { name: 'Suspicious', value: suspiciousTotal },
    { name: 'Fraud Rings', value: ringsTotal },
  ].filter((d) => d.value > 0)

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Bar chart: recent analyses */}
      <Card className="group relative overflow-hidden border-border bg-card shadow-lg transition-all hover:shadow-xl lg:col-span-3">
        {/* Gradient decoration */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        
        <CardHeader className="relative space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <TrendingUp className="size-4 text-primary" />
            </div>
            <CardTitle className="text-base">Recent Analyses</CardTitle>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Suspicious accounts and rings detected per analysis
          </p>
        </CardHeader>
        <CardContent className="relative">
          <div className="h-[280px] md:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barCategoryGap="20%">
                <defs>
                  <linearGradient id="suspiciousGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.58 0.22 25)" stopOpacity={1} />
                    <stop offset="100%" stopColor="oklch(0.58 0.22 25)" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="ringsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.18 310)" stopOpacity={1} />
                    <stop offset="100%" stopColor="oklch(0.55 0.18 310)" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.005 260)" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'oklch(0.50 0.01 260)', fontSize: 11 }}
                  axisLine={{ stroke: 'oklch(0.91 0.005 260)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'oklch(0.50 0.01 260)', fontSize: 11 }}
                  axisLine={{ stroke: 'oklch(0.91 0.005 260)' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid oklch(0.91 0.005 260)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    padding: '12px',
                  }}
                  labelFormatter={(_, payload) => {
                    if (payload?.[0]?.payload?.fileName) {
                      return payload[0].payload.fileName
                    }
                    return ''
                  }}
                  cursor={{ fill: 'oklch(0.95 0.01 260)', opacity: 0.3 }}
                />
                <Bar dataKey="suspicious" name="Suspicious" fill="url(#suspiciousGradient)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="rings" name="Rings" fill="url(#ringsGradient)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pie chart: overall distribution */}
      <Card className="group relative overflow-hidden border-border bg-card shadow-lg transition-all hover:shadow-xl lg:col-span-2">
        {/* Gradient decoration */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-forensic-ring/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        
        <CardHeader className="relative space-y-1">
          <CardTitle className="text-base">Account Distribution</CardTitle>
          <p className="text-xs leading-relaxed text-muted-foreground">Across all analyses</p>
        </CardHeader>
        <CardContent className="relative">
          <div className="h-[280px] md:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ color: 'oklch(0.35 0.01 260)', fontSize: '11px', fontWeight: 500 }}>{value}</span>
                  )}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid oklch(0.91 0.005 260)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    padding: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
