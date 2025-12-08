import Link from "next/link";
import { Compass, Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-16 w-full overflow-hidden">
      {/* Main footer container with dark background and rounded top corners */}
      <div className="bg-zinc-900 dark:bg-zinc-950 rounded-t-[2rem] md:rounded-t-[2.5rem] mx-2 md:mx-4">
        <div className="container relative z-10 py-12 md:py-16 px-6 md:px-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            {/* Brand & intro - Left side */}
            <div className="max-w-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Compass className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-wider text-white">
                  CareerGuide
                </span>
              </div>
              <p className="text-base md:text-lg font-medium text-white/90 leading-snug">
                Clarity for Indian B.Tech CS/IT students
              </p>
              
              {/* Built by with social links */}
              <div className="flex items-center gap-4 pt-4">
                <Link
                  href="https://www.linkedin.com/in/tatermohit/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Built by Mohit Tater
                </Link>
                <div className="flex items-center gap-3">
                  <Link
                    href="https://twitter.com/tatermohit"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Twitter"
                    className="text-zinc-500 hover:text-white transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                  </Link>
                  <Link
                    href="https://github.com/mnttnm/btech-cs-career-guide-india"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="text-zinc-500 hover:text-white transition-colors"
                  >
                    <Github className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Explore links column */}
            <div className="md:border-l md:border-zinc-700/50 md:pl-8 text-sm">
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
              </div>
            </div>
          </div>
        </div>

        {/* Large brand watermark at the bottom */}
        <div className="relative overflow-hidden h-20 md:h-28 flex items-end justify-center">
          <div className="pointer-events-none select-none text-[4rem] md:text-[6.5rem] font-bold tracking-tight text-zinc-800/80 dark:text-zinc-800/60 leading-none translate-y-[35%]">
            CAREERGUIDE
          </div>
        </div>
      </div>
    </footer>
  );
}
