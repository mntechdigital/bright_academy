const Skeleton = ({ className }: { className: string }) => {
    return <div className={`bg-gray-200 animate-pulse rounded ${className}`} />;
  };
  
  const TableRow = () => {
    return (
      <div className="border-b px-4 py-4">
        <div className="grid grid-cols-6 gap-4 items-center">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    );
  };
  
  const TableHeader = () => {
    const headers = ['w-20', 'w-24', 'w-28', 'w-32', 'w-20', 'w-24'];
    
    return (
      <div className="border-b px-4 py-3 bg-gray-50">
        <div className="grid grid-cols-6 gap-4">
          {headers.map((width, index) => (
            <Skeleton key={index} className={`h-4 ${width}`} />
          ))}
        </div>
      </div>
    );
  };
  
  const LoadingSkeleton = () => {
    return (
      <section className="min-h-screen bg-gray-50 p-4 md:p-2 2xl:p-8">
        <div className="w-full shadow-sm rounded py-2 bg-white">
          {/* Header */}
          <div className="flex flex-row items-center justify-between px-6 pb-4 border-b">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
  
          {/* Search Form */}
          <div className="px-6 pt-6">
            <div className="flex w-full max-w-xs mb-4">
              <Skeleton className="h-9 flex-1 rounded-l" />
              <Skeleton className="h-9 w-9 rounded-r" />
            </div>
  
            {/* Table */}
            <div className="w-full rounded-lg">
              <TableHeader />
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default LoadingSkeleton;