import { Network, Upload, Search, ShieldCheck, BarChart3, Bell, Zap, Lock } from 'lucide-react'

const features = [
  {
    icon: Upload,
    title: 'Instant CSV Upload',
    description:
      'Drag and drop transaction files for instant analysis. Support for millions of rows with streaming processing and real-time feedback.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Network,
    title: 'Interactive Graph',
    description:
      'Explore transaction networks with our powerful visualization. Zoom, filter, search nodes, and uncover hidden connections instantly.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Search,
    title: 'Smart Ring Detection',
    description:
      'Automated detection of fraud patterns including cycles, layering, structuring, fan-out, and sophisticated money muling schemes.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: ShieldCheck,
    title: 'AI Suspicion Scoring',
    description:
      'Machine learning-powered scoring based on behavioral anomalies, pattern matches, network centrality, and velocity analysis.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: BarChart3,
    title: 'Real-time Dashboards',
    description:
      'Comprehensive analytics with sortable tables, trend charts, and summary cards for instant risk assessment and compliance reporting.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Bell,
    title: 'Pattern Alerts',
    description:
      'Instant detection of dormant activation, velocity spikes, smurfing, shell networks, and other money muling red flags.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Process 10,000+ transactions in under 3 seconds. Optimized algorithms ensure rapid analysis without compromising accuracy.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description:
      'Enterprise-grade security with encrypted data storage, role-based access control, and full compliance with financial regulations.',
    color: 'from-red-500 to-pink-500',
  },
]

export function Features() {
  return (
    <section id="features" className="relative px-6 py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute left-1/4 top-0 size-96 rounded-full bg-primary/5 blur-3xl"
        />
        <div
          className="absolute bottom-0 right-1/4 size-96 rounded-full bg-forensic-ring/5 blur-3xl"
        />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Capabilities
            </span>
          </div>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Everything You Need for{' '}
            <span className="gradient-text">Financial Forensics</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            From raw transaction data to actionable intelligence, Fintrace handles the full investigation pipeline with cutting-edge technology.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:shadow-primary/5"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Gradient overlay on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-forensic-ring/5 opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="relative">
                <div className={`mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} p-0.5 shadow-lg transition-transform group-hover:scale-110`}>
                  <div className="flex size-full items-center justify-center rounded-[10px] bg-card">
                    <feature.icon className="size-6 text-foreground" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Trusted by financial institutions worldwide
          </p>
        </div>
      </div>
    </section>
  )
}
