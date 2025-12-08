import Link from 'next/link'
import { AlertTriangle, ExternalLink, Github, FileText, Scale } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer | CareerGuide',
  description: 'Important disclaimer about the data and information provided on CareerGuide.',
}

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-6">
          <Scale className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Disclaimer
        </h1>
        <p className="text-lg text-muted-foreground">
          Please read this disclaimer carefully before using CareerGuide.
        </p>
      </div>

      {/* Disclaimer Content */}
      <div className="space-y-8">
        {/* Important Notice */}
        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold mb-2 text-amber-700 dark:text-amber-300">
                Important Notice
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The information provided on CareerGuide is for general informational and educational purposes only. It should not be considered as professional career advice.
              </p>
            </div>
          </div>
        </div>

        {/* Data Source */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Data Source & Generation</h2>
          </div>
          <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
            <p>
              All career information, salary data, job descriptions, and related content on this platform was <strong className="text-foreground">generated using Claude&apos;s research feature</strong> (an AI assistant by Anthropic).
            </p>
            <p>
              This data represents <strong className="text-foreground">research-based information</strong> compiled from various public sources and does <strong className="text-foreground">not reflect the personal opinions</strong> of the creator.
            </p>
          </div>
        </section>

        {/* Data Accuracy */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Data Accuracy & Currency</h2>
          </div>
          <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">The data may not be up-to-date.</strong> The tech industry evolves rapidly, and salary ranges, job requirements, and market conditions can change frequently.
            </p>
            <p>
              The creator of this application <strong className="text-foreground">is not responsible for updating or maintaining</strong> the accuracy of this information on an ongoing basis. The information may become outdated over time.
            </p>
          </div>
        </section>

        {/* User Responsibility */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">User Responsibility</h2>
          </div>
          <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">All decisions made using this application are solely the responsibility of the user.</strong>
            </p>
            <p>
              Before making any important career decisions, you should:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Verify information from multiple current sources</li>
              <li>Consult with career counselors or industry professionals</li>
              <li>Research specific companies and their current requirements</li>
              <li>Consider your personal circumstances and goals</li>
              <li>Check latest salary surveys and job market reports</li>
            </ul>
          </div>
        </section>

        {/* Raw Data Access */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Github className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Access Raw Data</h2>
          </div>
          <div className="pl-8 space-y-3 text-muted-foreground leading-relaxed">
            <p>
              The raw research data used to build this application is publicly available. You can access, review, and verify the source data on our GitHub repository:
            </p>
            <Link
              href="https://github.com/mnttnm/btech-cs-career-guide-india"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-800 text-white hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors font-medium text-sm"
            >
              <Github className="w-4 h-4" />
              View on GitHub
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Summary Box */}
        <div className="p-6 rounded-2xl bg-muted/50 border border-border mt-12">
          <h3 className="font-semibold mb-3">In Summary</h3>
          <p className="text-muted-foreground leading-relaxed">
            CareerGuide is a tool to help you explore career options, but it should be one of many resources you use in your career planning journey. Always do your own research and make informed decisions based on the most current information available.
          </p>
        </div>

        {/* Back Link */}
        <div className="text-center pt-8">
          <Link
            href="/"
            className="text-primary hover:underline font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
