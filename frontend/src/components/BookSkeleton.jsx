function BookSkeleton() {
  return (
    <div className="bg-gray-800 rounded-xl p-5 animate-pulse shadow-md">
      <div className="h-5 bg-gray-700 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>

      <div className="flex justify-between">
        <div className="h-6 bg-gray-700 rounded w-20"></div>
        <div className="h-6 bg-gray-700 rounded w-12"></div>
      </div>
    </div>
  );
}

export default BookSkeleton;