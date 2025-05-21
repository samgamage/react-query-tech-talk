export default function PostsListSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Title skeleton */}
      <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
      
      {/* Posts grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-md p-6"
          >
            {/* Post title skeleton */}
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-3 w-3/4" />
            
            {/* Post content skeletons */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 