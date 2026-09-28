export default function EventFormLoading() {
  return (
    <div className="space-y-8">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
      ))}
      <div className="flex justify-end gap-4">
        <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
    </div>
  )
}
