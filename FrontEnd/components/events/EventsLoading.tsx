export default function EventsLoading() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(9)].map((_, index) => (
          <div key={index} className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}
