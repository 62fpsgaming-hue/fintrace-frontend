'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload, FileText, X, AlertCircle, Loader2, Search, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAppStore } from '@/lib/store'
import { analyzeTransactions } from '@/lib/api'
import { DEMO_RESPONSE } from '@/lib/demo-data'
import { saveAnalysis } from '@/lib/supabase/queries'
import type { AppError } from '@/lib/types'

export function UploadPanel() {
  const {
    file,
    setFile,
    setAnalysisData,
    isLoading,
    setIsLoading,
    error,
    setError,
  } = useAppStore()

  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateAndSetFile = useCallback(
    (f: File) => {
      const allowedExtensions = ['.csv', '.tsv', '.xlsx', '.xls']
      const fileExt = '.' + f.name.split('.').pop()?.toLowerCase()
      
      if (!allowedExtensions.includes(fileExt)) {
        setError({
          message: 'Invalid file format. Please upload CSV, TSV, XLSX, or XLS file.',
          type: 'validation',
        })
        return
      }
      setError(null)
      setFile(f)
    },
    [setFile, setError],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) validateAndSetFile(droppedFile)
    },
    [validateAndSetFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (selected) validateAndSetFile(selected)
    },
    [validateAndSetFile],
  )

  const handleRemoveFile = useCallback(() => {
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [setFile])

  const handleAnalyze = useCallback(async () => {
    if (!file) {
      setError({ message: 'Please upload a file first.', type: 'validation' })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await analyzeTransactions(file)
      setAnalysisData(data)
      // Save to Supabase in the background (don't block UI)
      saveAnalysis(file.name, file.size, data).catch((saveErr) => {
        console.error('Failed to save analysis to history:', saveErr)
        // Don't show error to user - this is a background operation
      })
    } catch (err) {
      let message = 'An unexpected error occurred.'
      let type: AppError['type'] = 'server'
      
      if (err instanceof Error) {
        message = err.message
        if (message.includes('timed out')) {
          type = 'timeout'
        } else if (message.includes('fetch') || message.includes('network') || message.includes('Failed to fetch')) {
          type = 'network'
          message = 'Unable to connect to the analysis server. Please ensure the backend is running on the correct port.'
        }
      }
      
      setError({ message, type })
    } finally {
      setIsLoading(false)
    }
  }, [file, setIsLoading, setError, setAnalysisData])

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl transition-all hover:shadow-2xl hover:border-primary/30">
      <CardHeader className="space-y-2 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 shadow-lg shadow-primary/30">
            <Upload className="size-4.5 text-primary-foreground" />
          </div>
          <CardTitle className="text-base font-bold tracking-tight">Upload Transaction Data</CardTitle>
        </div>
        <CardDescription className="text-xs leading-relaxed text-muted-foreground/90">
          Upload CSV, TSV, or Excel file with columns: transaction_id, sender_id, receiver_id, amount, timestamp
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Drop zone with enhanced styling */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
          }}
          className={`
            group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed px-6 py-12 transition-all
            ${isDragOver ? 'scale-[1.02] border-primary bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 shadow-2xl shadow-primary/20' : 'border-border/60 hover:border-primary/60 hover:bg-gradient-to-br hover:from-primary/5 hover:to-transparent'}
            ${file ? 'border-emerald-500/60 bg-gradient-to-br from-emerald-500/15 via-emerald-500/10 to-emerald-500/5 shadow-lg shadow-emerald-500/10' : ''}
          `}
        >
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="absolute right-0 top-0 size-40 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 size-40 rounded-full bg-forensic-ring/15 blur-3xl" />
          </div>
          
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.tsv,.xlsx,.xls"
            onChange={handleFileChange}
            className="sr-only"
            aria-label="Upload transaction file"
          />
          {file ? (
            <div className="relative flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/30 via-emerald-500/20 to-emerald-500/10 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-500/30">
                <FileText className="size-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">{file.name}</p>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {(file.size / 1024).toFixed(1)} KB • Ready to analyze
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFile()
                }}
                className="ml-auto rounded-full bg-red-500/10 p-2 text-red-600 transition-all hover:bg-red-500/20 hover:scale-110 dark:text-red-400"
                aria-label="Remove file"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="relative text-center">
              <div className="mb-5 inline-flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 shadow-xl shadow-primary/20 ring-2 ring-primary/20 transition-transform group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-primary/30">
                <Upload className="size-9 text-primary" />
              </div>
              <p className="text-base font-bold text-foreground">
                Drag & drop your file here
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                or click to browse
              </p>
              <p className="mt-3 text-xs font-medium text-muted-foreground/80">
                CSV, TSV, XLSX, or XLS format
              </p>
            </div>
          )}
        </div>

        {/* Error display */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border-2 border-red-500/40 bg-gradient-to-br from-red-500/20 via-red-500/10 to-red-500/5 px-4 py-4 shadow-lg shadow-red-500/10">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-500/20">
              <AlertCircle className="size-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-red-700 dark:text-red-300">{error.message}</p>
              {error.type === 'timeout' && (
                <p className="mt-2 text-xs text-red-600/80 dark:text-red-400/80">
                  The server took too long to respond. Try a smaller file or try again later.
                </p>
              )}
              {error.type === 'network' && (
                <p className="mt-2 text-xs text-red-600/80 dark:text-red-400/80">
                  Check that the backend server is running on port 8001 and try again.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Analyze button with gradient */}
        <Button
          onClick={handleAnalyze}
          disabled={!file || isLoading}
          className="w-full gap-2.5 bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              <span className="font-semibold">Analyzing Transactions...</span>
            </>
          ) : (
            <>
              <Search className="size-5" />
              <span className="font-semibold">Analyze Transactions</span>
            </>
          )}
        </Button>

        <div className="relative flex items-center">
          <div className="flex-1 border-t border-border/60" />
          <span className="px-4 text-xs font-semibold text-muted-foreground/70">or</span>
          <div className="flex-1 border-t border-border/60" />
        </div>

        {/* Demo data button with enhanced styling */}
        <Button
          variant="outline"
          onClick={() => {
            setIsLoading(true)
            setError(null)
            setTimeout(() => {
              setAnalysisData(DEMO_RESPONSE)
              setIsLoading(false)
              // Save demo data to history
              saveAnalysis('demo-transactions.csv', 24576, DEMO_RESPONSE).catch(() => {})
            }, 1200)
          }}
          disabled={isLoading}
          className="w-full gap-2.5 border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-forensic-ring/10 font-semibold shadow-md transition-all hover:border-primary/50 hover:from-primary/15 hover:to-forensic-ring/15 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50"
          size="lg"
        >
          <Play className="size-4" />
          Load Demo Data
        </Button>
      </CardContent>
    </Card>
  )
}
