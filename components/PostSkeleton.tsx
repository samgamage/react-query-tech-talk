export default function PostSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button skeleton */}
      <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-6" />
      
      <article className="bg-white rounded-lg shadow-lg p-8">
        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-3/4" />
        
        {/* Content skeletons */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
        </div>
      </article>
    </div>
  );
} 