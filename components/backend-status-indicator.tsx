'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Loader2, AlertCircle, ExternalLink } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { checkBackendHealth } from '@/lib/api'

export function BackendStatusIndicator() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [showAlert, setShowAlert] = useState(false)
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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

  const isProduction = backendUrl.includes('railway.app') || backendUrl.includes('render.com')
  const isLocalhost = backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1')

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert variant="destructive" className="border-2 shadow-2xl">
        <AlertCircle className="size-5" />
        <AlertDescription className="ml-2">
          <div className="space-y-3">
            <div>
              <p className="font-bold">Backend Connection Failed</p>
              <p className="mt-1 text-sm">
                Cannot connect to: <code className="rounded bg-black/20 px-1 py-0.5 text-xs">{backendUrl}</code>
              </p>
            </div>
            
            {isLocalhost && (
              <div className="rounded-md bg-black/20 p-3 text-xs">
                <p className="font-semibold text-white">Start your backend server:</p>
                <div className="mt-2 space-y-1 font-mono">
                  <div className="text-white">cd backend</div>
                  <div className="text-white">uvicorn main:app --reload --port 8000</div>
                </div>
              </div>
            )}

            {isProduction && (
              <div className="rounded-md bg-black/20 p-3 text-xs">
                <p className="font-semibold text-white">Possible issues:</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>Backend is sleeping (Railway free tier)</li>
                  <li>Backend is redeploying</li>
                  <li>CORS not configured correctly</li>
                  <li>Wrong backend URL in environment variables</li>
                </ul>
                <a 
                  href={`${backendUrl}/health`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-white hover:underline"
                >
                  Test backend directly
                  <ExternalLink className="size-3" />
                </a>
              </div>
            )}

            {!isLocalhost && !isProduction && (
              <div className="rounded-md bg-black/20 p-3 text-xs">
                <p className="font-semibold text-white">Check your configuration:</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>Verify NEXT_PUBLIC_API_URL in Vercel</li>
                  <li>Ensure backend is deployed and running</li>
                  <li>Check CORS settings on backend</li>
                </ul>
              </div>
            )}

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
