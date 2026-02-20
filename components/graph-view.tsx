'use client'

import { useEffect, useRef, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Search, RotateCcw, Filter, ZoomIn, ZoomOut, Maximize } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { formatGraphNodes, formatGraphEdges } from '@/lib/graph-formatter'
import type { GraphNode } from '@/lib/types'

/* Ring colors for visual distinction */
const RING_COLORS = [
  '#a855f7', '#ec4899', '#f59e0b', '#06b6d4', '#84cc16', '#f97316',
]

function getRingColor(ringId: string | null, rings: string[]): string {
  if (!ringId) return 'transparent'
  const idx = rings.indexOf(ringId) % RING_COLORS.length
  return RING_COLORS[idx >= 0 ? idx : 0]
}

export function GraphView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const networkRef = useRef<unknown>(null)
  const analysisData = useAppStore((s) => s.analysisData)
  const isLoading = useAppStore((s) => s.isLoading)
  const setSelectedNode = useAppStore((s) => s.setSelectedNode)
  const filterRingId = useAppStore((s) => s.filterRingId)
  const setFilterRingId = useAppStore((s) => s.setFilterRingId)
  const searchAccountId = useAppStore((s) => s.searchAccountId)
  const setSearchAccountId = useAppStore((s) => s.setSearchAccountId)

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

  /* Filter nodes and edges */
  const filteredNodes = useMemo(() => {
    let nodes = graphNodes
    if (filterRingId) {
      nodes = nodes.filter((n) => n.ringId === filterRingId)
    }
    if (searchAccountId) {
      const query = searchAccountId.toLowerCase()
      nodes = nodes.filter((n) => n.id.toLowerCase().includes(query))
    }
    return nodes
  }, [graphNodes, filterRingId, searchAccountId])

  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map((n) => n.id))
    return graphEdges.filter((e) => nodeIds.has(e.from) && nodeIds.has(e.to))
  }, [graphEdges, filteredNodes])

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      const node = graphNodes.find((n) => n.id === nodeId)
      if (node) setSelectedNode(node)
    },
    [graphNodes, setSelectedNode],
  )

  /* Initialize and update vis-network */
  useEffect(() => {
    if (!containerRef.current || filteredNodes.length === 0) return

    let destroyed = false

    async function initNetwork() {
      const vis = await import('vis-network/standalone')
      if (destroyed || !containerRef.current) return

      const visNodes = filteredNodes.map((node) => ({
        id: node.id,
        label: node.label.length > 12 ? node.label.slice(0, 10) + '...' : node.label,
        title: `
          <div style="background:#fff;color:#1a1a2e;padding:8px 12px;border-radius:8px;font-size:12px;line-height:1.6;border:1px solid #e2e4ea;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            <strong>${node.id}</strong><br/>
            Score: ${node.suspicionScore}<br/>
            ${node.detectedPatterns.length > 0 ? 'Patterns: ' + node.detectedPatterns.join(', ') : 'No patterns detected'}
            ${node.ringId ? '<br/>Ring: ' + node.ringId : ''}
          </div>
        `,
        size: node.isSuspicious ? 24 + node.suspicionScore / 10 : 14,
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
        borderWidth: node.ringId ? 4 : 2,
        font: {
          color: '#3a3a5c',
          size: 11,
          face: 'Geist, sans-serif',
        },
        shape: 'dot',
      }))

      const visEdges = filteredEdges.map((edge) => ({
        from: edge.from,
        to: edge.to,
        arrows: { to: { enabled: true, scaleFactor: 0.8 } },
        color: {
          color: '#b0b4cc',
          highlight: '#6366f1',
          hover: '#6366f1',
          opacity: 0.6,
        },
        width: 1.5,
        smooth: { type: 'curvedCW', roundness: 0.15 },
      }))

      const data = {
        nodes: new vis.DataSet(visNodes),
        edges: new vis.DataSet(visEdges),
      }

      const options = {
        physics: {
          forceAtlas2Based: {
            gravitationalConstant: -40,
            centralGravity: 0.005,
            springLength: 120,
            springConstant: 0.06,
            damping: 0.42,
          },
          solver: 'forceAtlas2Based',
          stabilization: { iterations: 200 },
        },
        interaction: {
          hover: true,
          tooltipDelay: 100,
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
  }, [filteredNodes, filteredEdges, ringIds, handleNodeClick])

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
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (!analysisData) return null

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Transaction Network Graph</CardTitle>
            <CardDescription>
              {filteredNodes.length} nodes, {filteredEdges.length} edges
              {filterRingId && ` (filtered by Ring ${filterRingId})`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
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
        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search account ID..."
              value={searchAccountId}
              onChange={(e) => setSearchAccountId(e.target.value)}
              className="h-8 bg-secondary pl-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <select
              value={filterRingId || ''}
              onChange={(e) => setFilterRingId(e.target.value || null)}
              className="h-8 rounded-md border border-border bg-card px-2 text-sm text-foreground shadow-sm"
              aria-label="Filter by ring"
            >
              <option value="">All Rings</option>
              {ringIds.map((id) => (
                <option key={id} value={id}>
                  Ring {id}
                </option>
              ))}
            </select>
            {(filterRingId || searchAccountId) && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setFilterRingId(null)
                  setSearchAccountId('')
                }}
                aria-label="Clear filters"
              >
                <RotateCcw className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
            Money Flow
          </span>
        </div>
        <div
          ref={containerRef}
          className="h-[500px] w-full rounded-lg border border-border bg-secondary/30"
          aria-label="Transaction network graph visualization"
          role="img"
        />
      </CardContent>
    </Card>
  )
}
