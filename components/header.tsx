'use client'

import Link from 'next/link'
import { Shield, Download, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { downloadJsonReport } from '@/lib/api'

export function Header() {
  const analysisData = useAppStore((s) => s.analysisData)

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Back to home"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="h-5 w-px bg-border" />
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md">
            <Shield className="size-4.5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-foreground">
              Fintrace
            </h1>
            <p className="text-[11px] leading-none text-muted-foreground">
              Financial Forensics Engine
            </p>
          </div>
        </div>
      </div>
      {analysisData && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadJsonReport(analysisData)}
          className="gap-2"
        >
          <Download className="size-3.5" />
          <span className="hidden sm:inline">Export Report</span>
        </Button>
      )}
    </header>
  )
}
