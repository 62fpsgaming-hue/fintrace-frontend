import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTA() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-10 text-center shadow-sm md:p-14">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Ready to Uncover Hidden Networks?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-pretty text-muted-foreground">
          Upload your transaction data and let the graph engine surface fraud rings, suspicious accounts, and money muling patterns in seconds.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/auth/sign-up">
            <Button size="lg" className="gap-2 rounded-full px-8 shadow-md">
              Get Started Free
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="lg" className="rounded-full px-8">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
