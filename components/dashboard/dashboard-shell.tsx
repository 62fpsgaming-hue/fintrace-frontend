'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Shield,
  Download,
  ArrowLeft,
  LayoutDashboard,
  Search,
  LogOut,
  User as UserIcon,
  Settings,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UploadPanel } from '@/components/upload-panel'
import { EnhancedSummaryCards } from '@/components/enhanced-summary-cards'
import { EnhancedGraphView } from '@/components/enhanced-graph-view'
import { RingsTable } from '@/components/rings-table'
import { SuspiciousAccounts } from '@/components/suspicious-accounts'
import { EnhancedNodeDetailsPanel } from '@/components/enhanced-node-details-panel'
import { UserDashboard } from '@/components/dashboard/user-dashboard'
import { BackendStatusIndicator } from '@/components/backend-status-indicator'
import { useAppStore } from '@/lib/store'
import { downloadJsonReport } from '@/lib/api'
import { createClient } from '@/lib/supabase/client'
import type { AnalysisHistoryRecord } from '@/lib/types'

interface DashboardShellProps {
  user: { email: string; id: string } | null
  history: AnalysisHistoryRecord[]
  stats: {
    totalAnalyses: number
    totalSuspicious: number
    totalRings: number
    avgProcessingTime: number
  }
}

export function DashboardShell({ user, history, stats }: DashboardShellProps) {
  const router = useRouter()
  const analysisData = useAppStore((s) => s.analysisData)
  const [activeTab, setActiveTab] = useState<'overview' | 'analyze'>(user ? 'overview' : 'analyze')
  const [signingOut, setSigningOut] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {
      // Supabase not configured, just redirect
    }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Enhanced header with glass effect and gradient */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-forensic-ring/5 opacity-50" />
        <div className="relative flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-secondary hover:text-foreground hover:shadow-sm"
              aria-label="Back to home"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div className="hidden h-6 w-px bg-border md:block" />
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-forensic-ring shadow-lg shadow-primary/30 transition-transform hover:scale-105">
                <Shield className="size-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold tracking-tight text-foreground">
                  Fintrace
                </h1>
                <p className="text-[11px] font-medium leading-none text-muted-foreground">
                  Financial Forensics Engine
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export buttons with enhanced styling */}
            {analysisData && activeTab === 'analyze' && (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadJsonReport(analysisData)}
                  className="gap-1.5 shadow-sm transition-all hover:bg-primary/5 hover:shadow-md"
                >
                  <Download className="size-3.5" />
                  <span className="hidden sm:inline">JSON</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const { downloadCsvReport } = await import('@/lib/api')
                    downloadCsvReport(analysisData)
                  }}
                  className="gap-1.5 shadow-sm transition-all hover:bg-primary/5 hover:shadow-md"
                >
                  <Download className="size-3.5" />
                  <span className="hidden sm:inline">CSV</span>
                </Button>
                <div className="mx-1 hidden h-6 w-px bg-border md:block" />
              </div>
            )}

            {user ? (
              <>
                {/* Enhanced user menu with dropdown */}
                {mounted ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 shadow-sm transition-all hover:bg-primary/5 hover:shadow-md"
                      >
                        <div className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-primary/20 to-forensic-ring/20">
                          <UserIcon className="size-3.5 text-primary" />
                        </div>
                        <span className="hidden max-w-[140px] truncate text-xs font-medium sm:inline">
                          {user.email}
                        </span>
                        <ChevronDown className="size-3.5 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">My Account</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex cursor-pointer items-center gap-2">
                          <UserIcon className="size-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile?tab=settings" className="flex cursor-pointer items-center gap-2">
                          <Settings className="size-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="cursor-pointer text-danger focus:text-danger"
                      >
                        <LogOut className="mr-2 size-4" />
                        <span>{signingOut ? 'Signing out...' : 'Sign Out'}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 shadow-sm"
                  >
                    <div className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-primary/20 to-forensic-ring/20">
                      <UserIcon className="size-3.5 text-primary" />
                    </div>
                    <span className="hidden max-w-[140px] truncate text-xs font-medium sm:inline">
                      {user.email}
                    </span>
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  </Button>
                )}
              </>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="gap-1.5 shadow-sm hover:bg-primary/5">
                  <UserIcon className="size-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Enhanced tab navigation with gradient */}
      <div className="relative border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-50" />
        <div className="relative mx-auto flex max-w-[1440px] gap-1 px-4 md:px-6">
          {user && (
            <button
              onClick={() => setActiveTab('overview')}
              className={`group relative flex items-center gap-2 px-4 py-4 text-sm font-medium transition-all md:px-5 ${
                activeTab === 'overview'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutDashboard className="size-4 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">My Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-lg shadow-primary/50" />
              )}
            </button>
          )}
          <button
            onClick={() => setActiveTab('analyze')}
            className={`group relative flex items-center gap-2 px-4 py-4 text-sm font-medium transition-all md:px-5 ${
              activeTab === 'analyze'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Search className="size-4 transition-transform group-hover:scale-110" />
            <span>Analyze</span>
            {activeTab === 'analyze' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-lg shadow-primary/50" />
            )}
          </button>
        </div>
      </div>

      {/* Main content with enhanced background */}
      <main className="relative flex-1 px-4 py-6 md:px-6 lg:py-8">
        {/* Subtle background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-0 size-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 size-96 rounded-full bg-forensic-ring/5 blur-3xl" />
        </div>
        
        <div className="relative mx-auto max-w-[1440px]">
          {activeTab === 'overview' ? (
            <div className="animate-fade-in">
              <UserDashboard history={history} stats={stats} />
            </div>
          ) : (
            <div className="flex flex-col gap-6 animate-fade-in">
              <EnhancedSummaryCards />
              {!analysisData ? (
                <div className="mx-auto w-full max-w-lg pt-8">
                  <UploadPanel />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(320px,380px)_1fr]">
                    <div className="flex flex-col gap-6">
                      <UploadPanel />
                    </div>
                    <EnhancedGraphView />
                  </div>
                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <RingsTable />
                    <SuspiciousAccounts />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <EnhancedNodeDetailsPanel />
      <BackendStatusIndicator />
    </div>
  )
}
