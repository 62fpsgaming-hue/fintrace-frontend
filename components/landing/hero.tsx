import Link from 'next/link'
import { ArrowRight, Shield, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative flex flex-col items-center overflow-hidden px-6 pb-24 pt-32 md:pt-40">
      {/* Enhanced background with multiple gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 0%, oklch(0.50 0.18 260 / 0.08), transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 20%, oklch(0.55 0.18 310 / 0.06), transparent 50%)',
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px),
                             linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* Main headline with gradient */}
      <h1 className="max-w-4xl animate-fade-in text-balance text-center text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-7xl md:leading-[1.1]">
        Detect Financial Fraud with{' '}
        <span className="gradient-text">Graph Intelligence</span>
      </h1>

      {/* Enhanced subtitle */}
      <p className="mt-6 max-w-2xl animate-fade-in text-pretty text-center text-lg leading-relaxed text-muted-foreground md:text-xl [animation-delay:100ms]">
        Uncover money muling rings, suspicious patterns, and hidden networks in seconds. 
        Powered by advanced graph algorithms and machine learning.
      </p>

      {/* Feature highlights */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground animate-fade-in [animation-delay:200ms]">
        {['Real-time Analysis', 'Graph Visualization', '99.2% Accuracy'].map((feature) => (
          <div key={feature} className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-success" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA Buttons with enhanced styling */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row animate-fade-in [animation-delay:300ms]">
        <Link href="/auth/sign-up">
          <Button 
            size="lg" 
            className="group gap-2 rounded-full px-8 py-6 text-base shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            Get Started Free
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        <a href="#how-it-works">
          <Button 
            variant="outline" 
            size="lg" 
            className="rounded-full px-8 py-6 text-base shadow-sm transition-all hover:shadow-md"
          >
            See How It Works
          </Button>
        </a>
      </div>

      {/* Enhanced stats bar with glass effect */}
      <div 
        id="stats" 
        className="mt-20 grid w-full max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-xl animate-fade-in [animation-delay:400ms] md:grid-cols-4"
      >
        {[
          { value: '1M+', label: 'Transactions Analyzed', icon: '📊' },
          { value: '<3s', label: 'Average Analysis Time', icon: '⚡' },
          { value: '99.2%', label: 'Detection Accuracy', icon: '🎯' },
          { value: '50+', label: 'Pattern Types', icon: '🔍' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group relative flex flex-col items-center gap-1 bg-card px-6 py-8 transition-all hover:bg-accent"
          >
            <span className="text-2xl mb-1">{stat.icon}</span>
            <span className="text-3xl font-bold tracking-tight text-foreground transition-transform group-hover:scale-110">
              {stat.value}
            </span>
            <span className="text-center text-xs leading-tight text-muted-foreground">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
