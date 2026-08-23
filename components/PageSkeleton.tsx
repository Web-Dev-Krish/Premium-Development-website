import Skeleton from './Skeleton';

export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Navbar placeholder */}
      <div className="h-[72px] border-b border-white/5 flex items-center justify-between max-w-7xl mx-auto px-6">
        <Skeleton className="h-6 w-28" />
        <div className="hidden md:flex items-center gap-8">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Hero placeholder */}
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20 flex flex-col items-center text-center">
        <Skeleton className="h-7 w-48 rounded-full mb-8" />
        <Skeleton className="h-12 w-full max-w-2xl mb-4" />
        <Skeleton className="h-12 w-full max-w-xl mb-6" />
        <Skeleton className="h-4 w-full max-w-lg mb-2" />
        <Skeleton className="h-4 w-full max-w-md mb-10" />
        <Skeleton className="h-12 w-44 rounded-full" />
      </div>

      {/* Cards placeholder */}
      <div className="max-w-7xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/10 overflow-hidden">
            <Skeleton className="h-40 w-full rounded-none" />
            <div className="p-6 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
