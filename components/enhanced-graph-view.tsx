'use client'

import { useEffect, useRef, useMemo, useCallback, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
  Search,
  RotateCcw,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize,
  Target,
  TrendingUp,
  Activity,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { formatGraphNodes, formatGraphEdges } from '@/lib/graph-formatter'
import type { GraphNode, FraudRing } from '@/lib/types'

/* Ring colors for visual distinction */
const RING_COLORS = [
  '#a855f7',
  '#ec4899',
  '#f59e0b',
  '#06b6d4',
  '#84cc16',
  '#f97316',
]

function getRingColor(ringId: string | null, rings: string[]): string {
  if (!ringId) return 'transparent'
  const idx = rings.indexOf(ringId) % RING_COLORS.length
  return RING_COLORS[idx >= 0 ? idx : 0]
}

type AnomalyFilter = 'all' | 'structuring' | 'round-trip' | 'velocity' | 'fan-out' | 'dormant'

export function EnhancedGraphView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const networkRef = useRef<unknown>(null)
  const analysisData = useAppStore((s) => s.analysisData)
  const isLoading = useAppStore((s) => s.isLoading)
  const setSelectedNode = useAppStore((s) => s.setSelectedNode)
  const filterRingId = useAppStore((s) => s.filterRingId)
  const setFilterRingId = useAppStore((s) => s.setFilterRingId)
  const searchAccountId = useAppStore((s) => s.searchAccountId)
  const setSearchAccountId = useAppStore((s) => s.setSearchAccountId)

  // Enhanced state
  const [isolatedRing, setIsolatedRing] = useState<string | null>(null)
  const [anomalyFilter, setAnomalyFilter] = useState<AnomalyFilter>('all')
  const [showEdgeLabels, setShowEdgeLabels] = useState(false)

  const graphNodes = useMemo(
    () => (analysisData ? formatGraphNodes(analysisData) : []),
    [analysisData],
  )
  const graphEdges = useMemo(
    () => (analysisData ? formatGraphEdges(analysisData) : []),
    [analysisData],
  )

  const ringIds = useMemo(
    () => (analysisData ? analysisData.fraud_rings.map((r) => r.ring_id) : []),
    [analysisData],
  )

  // Calculate network health score
  const networkHealth = useMemo(() => {
    if (!analysisData) return null
    
    const totalAccounts = analysisData.summary.total_accounts_analyzed
    const suspiciousRate = analysisData.summary.suspicious_accounts_flagged / totalAccounts
    const ringDensity = analysisData.fraud_rings.length / Math.max(totalAccounts, 1)
    
    // Network risk level (0-100)
    const riskScore = Math.min(100, (suspiciousRate * 50 + ringDensity * 100) * 100)
    
    return {
      score: riskScore,
      level: riskScore > 70 ? 'High' : riskScore > 40 ? 'Elevated' : 'Normal',
      suspiciousRate: (suspiciousRate * 100).toFixed(2),
      ringDensity: (ringDensity * 100).toFixed(2),
    }
  }, [analysisData])

  /* Filter nodes and edges */
  const filteredNodes = useMemo(() => {
    let nodes = graphNodes
    
    // Ring isolation
    if (isolatedRing) {
      nodes = nodes.filter((n) => n.ringId === isolatedRing)
    } else if (filterRingId) {
      nodes = nodes.filter((n) => n.ringId === filterRingId)
    }
    
    // Search filter
    if (searchAccountId) {
      const query = searchAccountId.toLowerCase()
      nodes = nodes.filter((n) => n.id.toLowerCase().includes(query))
    }
    
    // Anomaly type filter
    if (anomalyFilter !== 'all') {
      nodes = nodes.filter((n) => {
        const patterns = n.detectedPatterns.map(p => p.toLowerCase())
        switch (anomalyFilter) {
          case 'structuring':
            return patterns.some(p => p.includes('smurfing') || p.includes('structuring'))
          case 'round-trip':
            return patterns.some(p => p.includes('cycle') || p.includes('round'))
          case 'velocity':
            return patterns.some(p => p.includes('velocity') || p.includes('rapid'))
          case 'fan-out':
            return patterns.some(p => p.includes('fan') || p.includes('disperse'))
          case 'dormant':
            return patterns.some(p => p.includes('dormant') || p.includes('inactive'))
          default:
            return true
        }
      })
    }
    
    return nodes
  }, [graphNodes, isolatedRing, filterRingId, searchAccountId, anomalyFilter])

  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map((n) => n.id))
    return graphEdges.filter((e) => nodeIds.has(e.from) && nodeIds.has(e.to))
  }, [graphEdges, filteredNodes])

  // Get isolated ring details
  const isolatedRingData = useMemo(() => {
    if (!isolatedRing || !analysisData) return null
    return analysisData.fraud_rings.find(r => r.ring_id === isolatedRing)
  }, [isolatedRing, analysisData])

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      const node = graphNodes.find((n) => n.id === nodeId)
      if (node) setSelectedNode(node)
    },
    [graphNodes, setSelectedNode],
  )

  const handleIsolateRing = (ringId: string) => {
    setIsolatedRing(isolatedRing === ringId ? null : ringId)
  }

  /* Initialize and update vis-network */
  useEffect(() => {
    if (!containerRef.current || filteredNodes.length === 0) return

    let destroyed = false

    async function initNetwork() {
      const vis = await import('vis-network/standalone')
      if (destroyed || !containerRef.current) return

      const visNodes = filteredNodes.map((node) => {
        // Calculate node size based on suspicion score and connections
        const baseSize = node.isSuspicious ? 20 : 12
        const scoreBonus = node.suspicionScore / 10
        const size = baseSize + scoreBonus

        // Determine opacity based on isolation mode
        const opacity = isolatedRing && node.ringId !== isolatedRing ? 0.2 : 1

        return {
          id: node.id,
          label: node.label.length > 12 ? node.label.slice(0, 10) + '...' : node.label,
          title: `
            <div style="background:#fff;color:#1a1a2e;padding:10px 14px;border-radius:10px;font-size:12px;line-height:1.7;border:1px solid #e2e4ea;box-shadow:0 6px 16px rgba(0,0,0,0.12);min-width:200px;">
              <div style="font-weight:700;font-size:13px;margin-bottom:6px;color:#3b82f6;">${node.id}</div>
              <div style="display:flex;justify-content:space-between;margin:4px 0;">
                <span style="color:#64748b;">Risk Score:</span>
                <span style="font-weight:600;color:${node.suspicionScore > 70 ? '#ef4444' : '#3b82f6'};">${node.suspicionScore}</span>
              </div>
              ${node.detectedPatterns.length > 0 ? `
                <div style="margin-top:8px;padding-top:8px;border-top:1px solid #e2e4ea;">
                  <div style="color:#64748b;font-size:11px;margin-bottom:4px;">Patterns:</div>
                  <div style="color:#1a1a2e;font-size:11px;">${node.detectedPatterns.join(', ')}</div>
                </div>
              ` : ''}
              ${node.ringId ? `
                <div style="margin-top:8px;padding:6px 8px;background:#f1f5f9;border-radius:6px;font-size:11px;">
                  <span style="color:#64748b;">Ring:</span> <span style="font-weight:600;color:#a855f7;">${node.ringId}</span>
                </div>
              ` : ''}
            </div>
          `,
          size,
          color: {
            background: node.isSuspicious ? '#ef4444' : '#3b82f6',
            border: node.ringId
              ? getRingColor(node.ringId, ringIds)
              : node.isSuspicious
                ? '#dc2626'
                : '#2563eb',
            highlight: {
              background: node.isSuspicious ? '#f87171' : '#60a5fa',
              border: '#3b3b6b',
            },
            hover: {
              background: node.isSuspicious ? '#f87171' : '#60a5fa',
              border: '#3b3b6b',
            },
          },
          borderWidth: node.ringId ? 5 : 2,
          opacity,
          font: {
            color: '#3a3a5c',
            size: 11,
            face: 'Geist, sans-serif',
          },
          shape: 'dot',
        }
      })

      const visEdges = filteredEdges.map((edge) => {
        // Edge intelligence: thickness proportional to amount, opacity to frequency
        const amount = edge.totalAmount || edge.amount || 1000
        const frequency = edge.frequency || 1
        
        // Normalize values for visualization
        const thickness = Math.max(1, Math.min(8, Math.log10(amount) / 2))
        const opacity = Math.max(0.3, Math.min(1, frequency / 10))
        
        // Emphasize large flows
        const isLargeFlow = amount > 10000
        
        const edgeOpacity = isolatedRing ? 0.8 : opacity

        return {
          from: edge.from,
          to: edge.to,
          arrows: {
            to: {
              enabled: true,
              scaleFactor: isLargeFlow ? 1.2 : 0.8,
            },
          },
          title: `
            <div style="background:#fff;color:#1a1a2e;padding:8px 12px;border-radius:8px;font-size:11px;line-height:1.6;border:1px solid #e2e4ea;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
              <div style="font-weight:600;margin-bottom:4px;">Transaction Flow</div>
              <div style="display:flex;justify-content:space-between;margin:3px 0;">
                <span style="color:#64748b;">Total Amount:</span>
                <span style="font-weight:600;">$${(edge.totalAmount || edge.amount || 0).toLocaleString()}</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin:3px 0;">
                <span style="color:#64748b;">Frequency:</span>
                <span style="font-weight:600;">${edge.frequency || 1} txns</span>
              </div>
              ${edge.lastTransaction ? `
                <div style="display:flex;justify-content:space-between;margin:3px 0;">
                  <span style="color:#64748b;">Last Transaction:</span>
                  <span style="font-size:10px;">${new Date(edge.lastTransaction).toLocaleString()}</span>
                </div>
              ` : ''}
            </div>
          `,
          color: {
            color: isLargeFlow ? '#f59e0b' : '#b0b4cc',
            highlight: '#6366f1',
            hover: '#6366f1',
            opacity: edgeOpacity,
          },
          width: thickness,
          smooth: { type: 'curvedCW', roundness: 0.15 },
          label: showEdgeLabels && isLargeFlow ? `$${(amount / 1000).toFixed(0)}k` : undefined,
          font: {
            size: 10,
            color: '#64748b',
            strokeWidth: 0,
            align: 'middle',
          },
        }
      })

      const data = {
        nodes: new vis.DataSet(visNodes),
        edges: new vis.DataSet(visEdges),
      }

      const options = {
        physics: {
          forceAtlas2Based: {
            gravitationalConstant: -50,
            centralGravity: 0.008,
            springLength: 150,
            springConstant: 0.05,
            damping: 0.45,
          },
          solver: 'forceAtlas2Based',
          stabilization: { iterations: 250 },
        },
        interaction: {
          hover: true,
          tooltipDelay: 80,
          zoomView: true,
          dragView: true,
          multiselect: false,
        },
        layout: { randomSeed: 42 },
      }

      const network = new vis.Network(containerRef.current!, data, options)
      networkRef.current = network

      network.on('click', (params: { nodes: string[] }) => {
        if (params.nodes.length > 0) {
          handleNodeClick(params.nodes[0])
        }
      })
    }

    initNetwork()

    return () => {
      destroyed = true
      if (networkRef.current && typeof (networkRef.current as { destroy: () => void }).destroy === 'function') {
        (networkRef.current as { destroy: () => void }).destroy()
      }
    }
  }, [filteredNodes, filteredEdges, ringIds, handleNodeClick, isolatedRing, showEdgeLabels])

  const handleZoomIn = () => {
    const network = networkRef.current as { getScale: () => number; moveTo: (opts: { scale: number }) => void } | null
    if (network) {
      const scale = network.getScale()
      network.moveTo({ scale: scale * 1.3 })
    }
  }

  const handleZoomOut = () => {
    const network = networkRef.current as { getScale: () => number; moveTo: (opts: { scale: number }) => void } | null
    if (network) {
      const scale = network.getScale()
      network.moveTo({ scale: scale / 1.3 })
    }
  }

  const handleFit = () => {
    const network = networkRef.current as { fit: (opts: { animation: boolean }) => void } | null
    if (network) {
      network.fit({ animation: true })
    }
  }

  if (isLoading) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Network Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[600px] w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (!analysisData) return null

  return (
    <div className="space-y-4">
      {/* Network Health Score */}
      {networkHealth && (
        <Card className="border-border bg-gradient-to-br from-card to-card/50 shadow-sm">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <Activity className="size-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Network Risk Level</p>
                  <p className="text-2xl font-bold text-foreground">{networkHealth.level}</p>
                </div>
              </div>
              <div className="flex gap-6 text-sm">
                <div className="text-right">
                  <p className="text-muted-foreground">Suspicious Rate</p>
                  <p className="font-mono font-semibold text-foreground">{networkHealth.suspiciousRate}%</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Ring Density</p>
                  <p className="font-mono font-semibold text-foreground">{networkHealth.ringDensity}%</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Risk Score</p>
                  <p className={`font-mono text-lg font-bold ${networkHealth.score > 70 ? 'text-danger' : networkHealth.score > 40 ? 'text-warning' : 'text-success'}`}>
                    {networkHealth.score.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base">Transaction Network Graph</CardTitle>
                <CardDescription>
                  {filteredNodes.length} nodes, {filteredEdges.length} edges
                  {isolatedRing && ` • Isolated: Ring ${isolatedRing}`}
                  {filterRingId && !isolatedRing && ` • Filtered: Ring ${filterRingId}`}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEdgeLabels(!showEdgeLabels)}
                  className="gap-2"
                >
                  <TrendingUp className="size-4" />
                  {showEdgeLabels ? 'Hide' : 'Show'} Amounts
                </Button>
                <Button variant="outline" size="icon-sm" onClick={handleZoomIn} aria-label="Zoom in">
                  <ZoomIn className="size-4" />
                </Button>
                <Button variant="outline" size="icon-sm" onClick={handleZoomOut} aria-label="Zoom out">
                  <ZoomOut className="size-4" />
                </Button>
                <Button variant="outline" size="icon-sm" onClick={handleFit} aria-label="Fit to view">
                  <Maximize className="size-4" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search account ID..."
                  value={searchAccountId}
                  onChange={(e) => setSearchAccountId(e.target.value)}
                  className="h-9 bg-secondary pl-9 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-muted-foreground" />
                <select
                  value={anomalyFilter}
                  onChange={(e) => setAnomalyFilter(e.target.value as AnomalyFilter)}
                  className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground shadow-sm"
                  aria-label="Filter by anomaly type"
                >
                  <option value="all">All Anomalies</option>
                  <option value="structuring">Structuring</option>
                  <option value="round-trip">Round-trip</option>
                  <option value="velocity">Velocity Spike</option>
                  <option value="fan-out">Fan-out</option>
                  <option value="dormant">Dormant Activation</option>
                </select>
                <select
                  value={filterRingId || ''}
                  onChange={(e) => {
                    setFilterRingId(e.target.value || null)
                    setIsolatedRing(null)
                  }}
                  className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground shadow-sm"
                  aria-label="Filter by ring"
                >
                  <option value="">All Rings</option>
                  {ringIds.map((id) => (
                    <option key={id} value={id}>
                      Ring {id}
                    </option>
                  ))}
                </select>
                {(filterRingId || searchAccountId || isolatedRing || anomalyFilter !== 'all') && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      setFilterRingId(null)
                      setSearchAccountId('')
                      setIsolatedRing(null)
                      setAnomalyFilter('all')
                    }}
                    aria-label="Clear filters"
                  >
                    <RotateCcw className="size-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Ring Isolation Controls */}
            {analysisData.fraud_rings.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Target className="size-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Isolate Ring:</span>
                {analysisData.fraud_rings.map((ring) => (
                  <Button
                    key={ring.ring_id}
                    variant={isolatedRing === ring.ring_id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleIsolateRing(ring.ring_id)}
                    className="h-7 gap-1.5 px-3 text-xs"
                    style={{
                      borderColor: isolatedRing === ring.ring_id ? getRingColor(ring.ring_id, ringIds) : undefined,
                    }}
                  >
                    Ring {ring.ring_id}
                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                      {ring.member_count}
                    </Badge>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {/* Graph */}
            <div className="flex-1">
              {/* Legend */}
              <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block size-3 rounded-full bg-[#ef4444]" />
                  Suspicious
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block size-3 rounded-full bg-[#3b82f6]" />
                  Normal
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block size-3 rounded-full border-2 border-[#a855f7] bg-transparent" />
                  Ring Member
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-0.5 w-4 bg-[#b0b4cc]" />
                  Normal Flow
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-1 w-4 bg-[#f59e0b]" />
                  Large Flow
                </span>
              </div>
              <div
                ref={containerRef}
                className="h-[600px] w-full rounded-lg border border-border bg-secondary/30"
                aria-label="Transaction network graph visualization"
                role="img"
              />
            </div>

            {/* Ring Metrics Panel */}
            {isolatedRingData && (
              <Card className="w-72 border-border bg-gradient-to-br from-card to-secondary/20 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Ring {isolatedRingData.ring_id} Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Pattern Type</p>
                    <Badge variant="outline" className="text-xs">
                      {isolatedRingData.pattern_type}
                    </Badge>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Risk Score</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-danger">
                        {isolatedRingData.risk_score.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">/ 100</span>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Member Count</p>
                    <p className="font-mono text-lg font-semibold text-foreground">
                      {isolatedRingData.member_count}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Ring Density</p>
                    <p className="font-mono text-sm text-foreground">
                      {((isolatedRingData.member_count / (analysisData?.summary.total_accounts_analyzed || 1)) * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/50 p-3">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">Member Accounts</p>
                    <div className="max-h-32 space-y-1 overflow-y-auto text-xs">
                      {isolatedRingData.member_accounts.map((acc) => (
                        <div key={acc} className="font-mono text-foreground">
                          {acc}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
