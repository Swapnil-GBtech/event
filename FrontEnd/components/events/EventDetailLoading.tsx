export default function EventDetailLoading() {
  return (
    <div className="container mx-auto px-4">
      <div className="max-w-5xl mx-auto">
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse mb-8"></div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="h-10 bg-gray-200 rounded animate-pulse mb-4 w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse mb-4"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-6 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>

            <div className="h-1 bg-gray-200 rounded animate-pulse mb-8"></div>

            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-1/3"></div>
              <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-80 bg-gray-50 p-6 rounded-lg h-fit">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div key={index}>
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            <div className="h-1 bg-gray-200 rounded animate-pulse my-6"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
