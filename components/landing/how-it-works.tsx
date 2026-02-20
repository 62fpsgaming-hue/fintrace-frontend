import { FileUp, Cpu, Eye } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: FileUp,
    title: 'Upload',
    description:
      'Drop your transaction CSV into the dashboard. The file is parsed client-side and sent securely to the analysis engine.',
  },
  {
    step: '02',
    icon: Cpu,
    title: 'Analyze',
    description:
      'The backend builds a directed graph, runs pattern-matching algorithms, and scores each account for suspicious behavior.',
  },
  {
    step: '03',
    icon: Eye,
    title: 'Investigate',
    description:
      'Explore the interactive graph, review fraud ring tables, and drill into individual account details to take action.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-border bg-secondary/40 px-6 py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Workflow
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
            Three simple steps from raw data to fraud insights.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item, idx) => (
            <div key={item.step} className="relative flex flex-col items-center text-center">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="absolute left-[calc(50%+40px)] top-10 hidden h-px w-[calc(100%-80px)] bg-border md:block" />
              )}
              <div className="relative mb-5 flex size-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                <item.icon className="size-8 text-primary" />
                <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {item.step}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
