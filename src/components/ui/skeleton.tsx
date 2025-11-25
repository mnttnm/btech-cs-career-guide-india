import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton", className)}
      {...props}
    />
  )
}

// Role card skeleton for browse page
function RoleCardSkeleton() {
  return (
    <div className="p-4 rounded-2xl border bg-card">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex gap-1">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// Browse page skeleton
function BrowsePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="h-11 w-32 rounded-xl" />
        <Skeleton className="h-11 w-24 rounded-xl" />
      </div>

      {/* Results count */}
      <Skeleton className="h-4 w-24 mb-4" />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <RoleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export { Skeleton, RoleCardSkeleton, BrowsePageSkeleton }
