'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestAuthPage() {
  const [status, setStatus] = useState<any>({})

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      
      if (!supabase) {
        setStatus({
          configured: false,
          message: 'Supabase client not configured - environment variables missing'
        })
        return
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        setStatus({
          configured: true,
          hasSession: !!session,
          user: session?.user?.email || null,
          error: error?.message || null,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        })
      } catch (err: any) {
        setStatus({
          configured: true,
          error: err.message
        })
      }
    }

    checkAuth()
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold">Auth Test Page</h1>
        
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Supabase Configuration Status</h2>
          
          <pre className="overflow-auto rounded bg-muted p-4 text-sm">
            {JSON.stringify(status, null, 2)}
          </pre>

          <div className="mt-6 space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Expected values:</strong>
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>configured: true</li>
              <li>supabaseUrl: should show your Supabase URL</li>
              <li>hasAnonKey: true</li>
              <li>hasSession: true (if logged in)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
