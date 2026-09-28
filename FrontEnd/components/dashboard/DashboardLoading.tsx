export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 h-32 animate-pulse"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md h-96 animate-pulse"></div>
        <div className="bg-white rounded-lg shadow-md h-96 animate-pulse"></div>
      </div>
    </div>
  )
}
