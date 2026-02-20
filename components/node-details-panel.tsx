'use client'

import { X, User, AlertTriangle, Fingerprint, Link } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAppStore } from '@/lib/store'

export function NodeDetailsPanel() {
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

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-sm"
        onClick={() => setSelectedNode(null)}
        aria-hidden
      />
      <div className="fixed inset-y-0 right-0 z-50 flex w-80 flex-col border-l border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Account Details</h3>
          <button
            type="button"
            onClick={() => setSelectedNode(null)}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Close panel"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
          {/* Account ID */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <User className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Account ID</p>
              <p className="font-mono text-sm font-medium text-foreground">{selectedNode.id}</p>
            </div>
          </div>

          {/* Suspicion Score */}
          <div className="rounded-lg border border-border bg-secondary/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Suspicion Score</span>
              </div>
              <span className={`text-2xl font-bold ${scoreColor}`}>
                {selectedNode.suspicionScore}
              </span>
            </div>
            <Progress value={selectedNode.suspicionScore} className={`h-2 ${progressClass}`} />
            <p className="mt-1.5 text-right text-[11px] text-muted-foreground">
              {selectedNode.suspicionScore >= 80
                ? 'High Risk'
                : selectedNode.suspicionScore >= 50
                  ? 'Medium Risk'
                  : 'Low Risk'}
            </p>
          </div>

          {/* Detected Patterns */}
          {selectedNode.detectedPatterns.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Fingerprint className="size-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Detected Patterns</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.detectedPatterns.map((pattern) => (
                  <Badge key={pattern} variant="outline" className="text-xs">
                    {pattern}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Ring ID */}
          {selectedNode.ringId && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Link className="size-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Fraud Ring</span>
              </div>
              <Badge className="bg-forensic-ring/15 text-forensic-ring border border-forensic-ring/30">
                Ring {selectedNode.ringId}
              </Badge>
            </div>
          )}

          {/* Status */}
          <div className="rounded-lg border border-border p-3">
            <p className="mb-1.5 text-[11px] text-muted-foreground">Classification</p>
            {selectedNode.isSuspicious ? (
              <Badge variant="destructive">Suspicious</Badge>
            ) : (
              <Badge variant="secondary">Normal</Badge>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
