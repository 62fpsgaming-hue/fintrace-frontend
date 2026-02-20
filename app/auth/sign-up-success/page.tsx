import Link from 'next/link'
import { ShieldCheck, MailCheck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignUpSuccessPage() {
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
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10">
              <MailCheck className="size-8 text-success" />
            </div>
            <div>
              <CardTitle className="font-serif text-2xl font-bold tracking-tight">Check Your Email</CardTitle>
              <CardDescription className="mt-2 text-sm">
                We've sent you a confirmation link to verify your email address.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <h3 className="mb-2 text-sm font-semibold text-foreground">Next Steps:</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">1.</span>
                  Open the confirmation email in your inbox
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">2.</span>
                  Click the verification link
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">3.</span>
                  You'll be redirected to your dashboard
                </li>
              </ol>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Didn't receive the email? Check your spam folder or{' '}
              <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
                try signing up again
              </Link>
              .
            </p>

            <Button asChild className="w-full gap-2" variant="outline">
              <Link href="/auth/login">
                Go to Login
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
