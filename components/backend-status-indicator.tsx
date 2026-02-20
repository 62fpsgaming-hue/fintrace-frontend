'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { checkBackendHealth } from '@/lib/api'

export function BackendStatusIndicator() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [showAlert, setShowAlert] = useState(false)

  const checkStatus = async () => {
    setStatus('checking')
    const isHealthy = await checkBackendHealth()
    setStatus(isHealthy ? 'connected' : 'disconnected')
    setShowAlert(!isHealthy)
  }

  useEffect(() => {
    checkStatus()
    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (status === 'connected') {
    return null // Don't show anything when connected
  }

  if (status === 'checking') {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 shadow-lg">
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Checking backend...</span>
        </div>
      </div>
    )
  }

  if (!showAlert) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert variant="destructive" className="border-2 shadow-2xl">
        <AlertCircle className="size-5" />
        <AlertDescription className="ml-2">
          <div className="space-y-3">
            <div>
              <p className="font-bold">Backend Server Not Running</p>
              <p className="mt-1 text-sm">
                The analysis server is not reachable. Please start the backend:
              </p>
            </div>
            <div className="rounded-md bg-black/20 p-3 font-mono text-xs">
              <div className="text-white">cd backend</div>
              <div className="text-white">./start.sh</div>
              <div className="mt-1 text-muted-foreground"># or start.bat on Windows</div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={checkStatus}
                className="flex-1 bg-white/10 hover:bg-white/20"
              >
                <CheckCircle2 className="mr-1.5 size-3.5" />
                Retry Connection
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAlert(false)}
                className="hover:bg-white/10"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
