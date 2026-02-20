'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { FileText, Trash2, Eye, Download, Star, Tag, StickyNote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { AnalysisHistoryRecord } from '@/lib/types'
import { deleteAnalysis, toggleAnalysisFavorite } from '@/lib/supabase/queries'
import { useRouter } from 'next/navigation'

interface AnalysisHistoryTableProps {
  history: AnalysisHistoryRecord[]
  onView: (record: AnalysisHistoryRecord) => void
}

export function AnalysisHistoryTable({ history, onView }: AnalysisHistoryTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingFavorite, setTogglingFavorite] = useState<string | null>(null)

  const handleToggleFavorite = async (id: string, currentState: boolean) => {
    setTogglingFavorite(id)
    try {
      await toggleAnalysisFavorite(id, !currentState)
      router.refresh()
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setTogglingFavorite(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return

    setDeletingId(id)
    try {
      await deleteAnalysis(id)
      router.refresh()
    } catch (error) {
      console.error('Failed to delete:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownload = (record: AnalysisHistoryRecord) => {
    const blob = new Blob([JSON.stringify(record.analysis_data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analysis-${record.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Card className="border-border bg-card shadow-lg transition-all hover:shadow-xl">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
            <FileText className="size-4 text-primary" />
          </div>
          <CardTitle className="text-base">Analysis History</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-xl border-2 border-dashed border-border bg-gradient-to-br from-secondary/30 to-transparent text-center">
            <div className="space-y-3 p-6">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10">
                <FileText className="size-8 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">No analyses yet</p>
              <p className="text-xs text-muted-foreground">
                Upload a CSV file to start your first analysis
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="w-8"></TableHead>
                  <TableHead className="font-semibold">File</TableHead>
                  <TableHead className="text-center font-semibold">Accounts</TableHead>
                  <TableHead className="text-center font-semibold">Suspicious</TableHead>
                  <TableHead className="text-center font-semibold">Rings</TableHead>
                  <TableHead className="text-right font-semibold">Date</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record, index) => (
                  <TableRow 
                    key={record.id} 
                    className="group transition-colors hover:bg-primary/5 animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <TableCell className="w-8">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleToggleFavorite(record.id, record.is_favorite || false)}
                        disabled={togglingFavorite === record.id}
                        title={record.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                        className={record.is_favorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground hover:text-yellow-500'}
                      >
                        <Star className={`size-3.5 ${record.is_favorite ? 'fill-current' : ''}`} />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-[180px]">
                        <p className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">{record.file_name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatFileSize(record.file_size)}</span>
                          {record.tags && record.tags.length > 0 && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Tag className="size-3" />
                                <span>{record.tags.length}</span>
                              </div>
                            </>
                          )}
                          {record.notes && (
                            <>
                              <span>•</span>
                              <StickyNote className="size-3" />
                            </>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-mono text-sm font-medium">{record.total_accounts}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={record.suspicious_accounts > 0 ? 'destructive' : 'secondary'} 
                        className="font-mono text-xs shadow-sm"
                      >
                        {record.suspicious_accounts}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={record.fraud_rings_detected > 0 ? 'destructive' : 'secondary'} 
                        className="font-mono text-xs shadow-sm"
                      >
                        {record.fraud_rings_detected}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(record.created_at), 'MMM d, yyyy')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(record.created_at), 'h:mm a')}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => onView(record)}
                          title="View details"
                          className="transition-all hover:bg-primary/10 hover:text-primary"
                        >
                          <Eye className="size-3.5" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => handleDownload(record)}
                          title="Download JSON"
                          className="transition-all hover:bg-success/10 hover:text-success"
                        >
                          <Download className="size-3.5" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => handleDelete(record.id)}
                          disabled={deletingId === record.id}
                          title="Delete"
                          className="text-danger transition-all hover:bg-danger/10 hover:text-danger"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
