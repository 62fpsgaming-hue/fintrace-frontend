import Link from 'next/link'
import { ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_description?: string }>
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <span className="font-serif text-xl font-bold tracking-tight text-foreground">Fintrace</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-border bg-card shadow-lg">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-danger/10">
              <AlertCircle className="size-8 text-danger" />
            </div>
            <div>
              <CardTitle className="font-serif text-2xl font-bold tracking-tight">Authentication Error</CardTitle>
              <CardDescription className="mt-2 text-sm">
                We encountered a problem signing you in.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
              {(searchParams as any)?.error_description || (searchParams as any)?.error || 'An unknown error occurred'}
            </div>

            <div className="space-y-2">
              <Button asChild className="w-full gap-2" variant="default">
                <Link href="/auth/login">
                  <ArrowLeft className="size-4" />
                  Back to Login
                </Link>
              </Button>
              <Button asChild className="w-full gap-2" variant="outline">
                <Link href="/">Go to Home</Link>
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Need help?{' '}
              <Link href="/" className="font-medium text-primary hover:underline">
                Contact support
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
