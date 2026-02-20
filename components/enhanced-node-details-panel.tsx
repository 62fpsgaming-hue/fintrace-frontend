'use client'

import { X, User, AlertTriangle, Fingerprint, Link, PieChart, TrendingUp, Activity, Target, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAppStore } from '@/lib/store'

// Risk decomposition calculation (mock - would come from backend in production)
function calculateRiskDecomposition(node: { suspicionScore: number; detectedPatterns: string[] }) {
  const patterns = node.detectedPatterns.map(p => p.toLowerCase())
  
  // Base decomposition
  let circularity = 0
  let velocity = 0
  let structuring = 0
  let centrality = 0
  let neighborPropagation = 0
  
  // Pattern-based scoring
  if (patterns.some(p => p.includes('cycle') || p.includes('round'))) {
    circularity = 25 + Math.random() * 15
  }
  if (patterns.some(p => p.includes('velocity') || p.includes('rapid'))) {
    velocity = 20 + Math.random() * 15
  }
  if (patterns.some(p => p.includes('smurfing') || p.includes('structuring'))) {
    structuring = 15 + Math.random() * 12
  }
  if (patterns.some(p => p.includes('fan') || p.includes('hub'))) {
    centrality = 12 + Math.random() * 10
  }
  
  // Neighbor propagation based on score
  neighborPropagation = Math.max(0, node.suspicionScore * 0.15)
  
  // Normalize to match suspicion score
  const total = circularity + velocity + structuring + centrality + neighborPropagation
  const factor = total > 0 ? node.suspicionScore / total : 0
  
  return {
    circularity: Math.round(circularity * factor),
    velocity: Math.round(velocity * factor),
    structuring: Math.round(structuring * factor),
    centrality: Math.round(centrality * factor),
    neighborPropagation: Math.round(neighborPropagation * factor),
  }
}

export function EnhancedNodeDetailsPanel() {
  const selectedNode = useAppStore((s) => s.selectedNode)
  const setSelectedNode = useAppStore((s) => s.setSelectedNode)

  if (!selectedNode) return null

  const scoreColor =
    selectedNode.suspicionScore >= 80
      ? 'text-danger'
      : selectedNode.suspicionScore >= 50
        ? 'text-warning'
        : 'text-primary'

  const progressClass =
    selectedNode.suspicionScore >= 80
      ? '[&>div]:bg-danger'
      : selectedNode.suspicionScore >= 50
        ? '[&>div]:bg-warning'
        : ''

  const riskDecomposition = calculateRiskDecomposition(selectedNode)
  const decompositionItems = [
    { label: 'Circularity', value: riskDecomposition.circularity, icon: Activity, color: 'bg-purple-500' },
    { label: 'Velocity', value: riskDecomposition.velocity, icon: TrendingUp, color: 'bg-blue-500' },
    { label: 'Structuring', value: riskDecomposition.structuring, icon: Target, color: 'bg-orange-500' },
    { label: 'Centrality', value: riskDecomposition.centrality, icon: Users, color: 'bg-green-500' },
    { label: 'Neighbor Propagation', value: riskDecomposition.neighborPropagation, icon: Link, color: 'bg-pink-500' },
  ].filter(item => item.value > 0)

  return (
    <>
      {/* Backdrop overlay with gradient */}
      <div
        className="fixed inset-0 z-40 bg-gradient-to-br from-foreground/10 via-foreground/5 to-foreground/10 backdrop-blur-sm"
        onClick={() => setSelectedNode(null)}
        aria-hidden
      />
      <div className="fixed inset-y-0 right-0 z-50 flex w-96 flex-col border-l border-border/50 bg-card shadow-2xl">
        {/* Header with gradient */}
        <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-r from-primary/10 via-primary/5 to-forensic-ring/10 px-4 py-4">
          {/* Animated background */}
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute right-0 top-0 size-32 rounded-full bg-primary/30 blur-2xl animate-pulse-slow" />
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/20 shadow-lg">
                <PieChart className="size-5 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground">Risk Analysis</h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground hover:shadow-sm"
              aria-label="Close panel"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
          {/* Account ID with gradient */}
          <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-4 transition-all hover:shadow-lg">
            <div className="absolute right-0 top-0 size-20 rounded-bl-full bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
                <User className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">Account ID</p>
                <p className="font-mono text-base font-bold text-foreground">{selectedNode.id}</p>
              </div>
            </div>
          </div>

          {/* Suspicion Score with enhanced gradient */}
          <div className={`relative overflow-hidden rounded-xl border shadow-lg transition-all ${
            selectedNode.suspicionScore >= 80
              ? 'border-danger/30 bg-gradient-to-br from-danger/15 to-danger/5'
              : selectedNode.suspicionScore >= 50
                ? 'border-warning/30 bg-gradient-to-br from-warning/15 to-warning/5'
                : 'border-primary/30 bg-gradient-to-br from-primary/15 to-primary/5'
          }`}>
            {/* Animated background decoration */}
            <div className="pointer-events-none absolute inset-0 opacity-20">
              <div className={`absolute right-0 top-0 size-32 rounded-full blur-2xl animate-pulse-slow ${
                selectedNode.suspicionScore >= 80 ? 'bg-danger' :
                selectedNode.suspicionScore >= 50 ? 'bg-warning' : 'bg-primary'
              }`} />
            </div>
            
            <div className="relative p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex size-8 items-center justify-center rounded-lg shadow-lg ${
                    selectedNode.suspicionScore >= 80 ? 'bg-danger/20' :
                    selectedNode.suspicionScore >= 50 ? 'bg-warning/20' : 'bg-primary/20'
                  }`}>
                    <AlertTriangle className={`size-4 ${
                      selectedNode.suspicionScore >= 80 ? 'text-danger' :
                      selectedNode.suspicionScore >= 50 ? 'text-warning' : 'text-primary'
                    }`} />
                  </div>
                  <span className="text-xs font-semibold text-foreground">Risk Score</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${scoreColor}`}>
                    {selectedNode.suspicionScore}
                  </span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
              </div>
              <Progress value={selectedNode.suspicionScore} className={`h-3 shadow-sm ${progressClass}`} />
              <p className="mt-3 text-right text-xs font-semibold text-foreground">
                {selectedNode.suspicionScore >= 80
                  ? '🚨 High Risk - Immediate Review Required'
                  : selectedNode.suspicionScore >= 50
                    ? '⚠️ Medium Risk - Monitor Closely'
                    : '✓ Low Risk - Standard Monitoring'}
              </p>
            </div>
          </div>

          {/* Risk Decomposition with colorful bars */}
          <div className="rounded-xl border border-border bg-gradient-to-br from-card to-secondary/20 p-5 shadow-lg">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                <PieChart className="size-4 text-primary" />
              </div>
              <span className="text-sm font-bold text-foreground">Risk Breakdown</span>
            </div>
            <div className="space-y-4">
              {decompositionItems.map((item) => {
                const Icon = item.icon
                const percentage = ((item.value / selectedNode.suspicionScore) * 100).toFixed(0)
                return (
                  <div key={item.label} className="group/item">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`flex size-6 items-center justify-center rounded-lg ${item.color}/20 shadow-sm transition-transform group-hover/item:scale-110`}>
                          <Icon className={`size-3.5 ${item.color.replace('bg-', 'text-')}`} />
                        </div>
                        <span className="font-semibold text-foreground">{item.label}</span>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-mono text-base font-bold text-foreground">{item.value}</span>
                        <span className="text-muted-foreground">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
                      <div 
                        className={`h-full rounded-full ${item.color} shadow-lg transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-5 rounded-lg border border-border/50 bg-gradient-to-br from-secondary/50 to-secondary/30 p-4 text-xs backdrop-blur-sm">
              <p className="font-semibold text-foreground">📊 Audit Trail</p>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                This risk score is calculated using multiple fraud detection algorithms including graph analysis, 
                temporal patterns, and behavioral anomalies. Each component contributes to the overall assessment.
              </p>
            </div>
          </div>

          {/* Detected Patterns with colorful badges */}
          {selectedNode.detectedPatterns.length > 0 && (
            <div className="rounded-xl border border-border bg-gradient-to-br from-card to-secondary/20 p-5 shadow-lg">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-warning/20 to-warning/10">
                  <Fingerprint className="size-4 text-warning" />
                </div>
                <span className="text-sm font-bold text-foreground">Detected Patterns</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedNode.detectedPatterns.map((pattern, idx) => (
                  <Badge 
                    key={pattern} 
                    variant="outline" 
                    className="animate-fade-in border-warning/30 bg-gradient-to-r from-warning/10 to-warning/5 text-xs font-semibold text-warning shadow-sm"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {pattern}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Ring ID with enhanced styling */}
          {selectedNode.ringId && (
            <div className="rounded-xl border border-forensic-ring/30 bg-gradient-to-br from-forensic-ring/15 to-forensic-ring/5 p-5 shadow-lg">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-forensic-ring/30 to-forensic-ring/20 shadow-lg">
                  <Link className="size-4 text-forensic-ring" />
                </div>
                <span className="text-sm font-bold text-foreground">Fraud Ring Membership</span>
              </div>
              <Badge className="border-forensic-ring/40 bg-gradient-to-r from-forensic-ring/30 to-forensic-ring/20 text-forensic-ring text-base font-bold shadow-lg">
                Ring {selectedNode.ringId}
              </Badge>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                This account is part of a detected fraud ring. All members should be reviewed together for coordinated activity patterns.
              </p>
            </div>
          )}

          {/* Status with gradient */}
          <div className={`rounded-xl border p-5 shadow-lg ${
            selectedNode.isSuspicious 
              ? 'border-danger/30 bg-gradient-to-br from-danger/10 to-danger/5' 
              : 'border-success/30 bg-gradient-to-br from-success/10 to-success/5'
          }`}>
            <p className="mb-3 text-xs font-semibold text-muted-foreground">Classification</p>
            {selectedNode.isSuspicious ? (
              <div className="space-y-3">
                <Badge variant="destructive" className="text-sm font-bold shadow-lg">
                  🚨 Suspicious Activity Detected
                </Badge>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Recommended action: Flag for compliance review and enhanced monitoring. Consider freezing transactions pending investigation.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Badge className="bg-success text-white text-sm font-bold shadow-lg">
                  ✓ Normal Activity
                </Badge>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  No immediate concerns. Continue standard monitoring protocols.
                </p>
              </div>
            )}
          </div>

          {/* Compliance Note with enhanced styling */}
          <div className="rounded-xl border border-warning/40 bg-gradient-to-br from-warning/15 to-warning/5 p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-warning/20">
                <span className="text-base">⚠️</span>
              </div>
              <div className="text-xs">
                <p className="font-bold text-warning">Compliance Note</p>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  This analysis is provided for investigative purposes. All flagged accounts should be reviewed 
                  by qualified compliance officers before taking action.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
