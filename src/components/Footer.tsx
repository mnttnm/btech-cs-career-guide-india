import Link from "next/link";
import { Compass, Github, Linkedin } from "lucide-react";

// Custom X (formerly Twitter) icon - lucide doesn't include brand logos
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-zinc-900 dark:bg-zinc-950">
      {/* Main footer container */}
      <div>
        <div className="container relative z-10 py-8 md:py-10 px-6 md:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Brand & intro - Left side */}
            <div className="max-w-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Compass className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-wider text-white">
                  CareerGuide
                </span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Helping B.Tech CS/IT students explore 45+ tech careers with real salary data, skill roadmaps, and personality-based recommendations.
              </p>
            </div>

            {/* Built by - Center */}
            <div className="flex flex-col items-center text-center space-y-3">
              <span className="text-sm text-zinc-400">
                Built by Mohit Tater
              </span>
              <div className="flex items-center gap-4">
                <Link
                  href="https://www.linkedin.com/in/tatermohit/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
                <Link
                  href="https://x.com/tatermohit"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X (formerly Twitter)"
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <XIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="https://github.com/mnttnm/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <Github className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Explore links column */}
            <div className="text-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-4">
                Explore
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/browse"
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  Browse Roles
                </Link>
                <Link
                  href="/quiz"
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  Take Quiz
                </Link>
                <Link
                  href="/compare"
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  Compare
                </Link>
                <Link
                  href="https://github.com/mnttnm/btech-cs-career-guide-india"
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-300 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  GitHub
                  <Github className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/disclaimer"
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  Disclaimer
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Large brand watermark at the bottom */}
        <div className="relative overflow-hidden h-12 md:h-16 flex items-end justify-center">
          <div className="pointer-events-none select-none text-[3rem] md:text-[4.5rem] font-bold tracking-tight text-zinc-800/80 dark:text-zinc-800/60 leading-none translate-y-[35%]">
            CAREERGUIDE
          </div>
        </div>
      </div>
    </footer>
  );
}
