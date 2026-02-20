import { Shield } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t border-border bg-card px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-3 md:items-start">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                <Shield className="size-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-foreground">Fintrace</span>
                <span className="text-[10px] font-medium tracking-wide text-muted-foreground">Financial Forensics</span>
              </div>
            </div>
            <p className="max-w-xs text-center text-sm text-muted-foreground md:text-left">
              Graph-based financial forensics platform for money muling detection and fraud analysis.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 text-sm md:grid-cols-3">
            <div>
              <h3 className="mb-3 font-semibold text-foreground">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="transition-colors hover:text-foreground">Features</a></li>
                <li><a href="#how-it-works" className="transition-colors hover:text-foreground">How It Works</a></li>
                <li><a href="#stats" className="transition-colors hover:text-foreground">Performance</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-semibold text-foreground">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/dashboard" className="transition-colors hover:text-foreground">Dashboard</a></li>
                <li><a href="/auth/sign-up" className="transition-colors hover:text-foreground">Get Started</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-semibold text-foreground">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="transition-colors hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="transition-colors hover:text-foreground">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Fintrace. All rights reserved. Advanced financial forensics powered by graph intelligence.
          </p>
        </div>
      </div>
    </footer>
  )
}
