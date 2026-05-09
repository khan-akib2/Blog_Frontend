export default function SkeletonCard({ compact = false }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className={`skeleton ${compact ? 'h-40' : 'h-52'} w-full`} />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="skeleton w-7 h-7 rounded-full" />
          <div className="skeleton h-3 w-24 rounded" />
        </div>
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
        {!compact && (
          <>
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-5/6 rounded" />
          </>
        )}
        <div className="flex gap-3 pt-2">
          <div className="skeleton h-3 w-12 rounded" />
          <div className="skeleton h-3 w-12 rounded" />
        </div>
      </div>
    </div>
  );
}
