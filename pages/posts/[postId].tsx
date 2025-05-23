import { FunctionComponent } from "react";
import PostSkeleton from "@/components/PostSkeleton";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getPostByIdQueryOptions } from "@/utils/queryOptions";

const PostPage: FunctionComponent = () => {
  const router = useRouter();
  const postId = router.query.postId as string;

  const { data: post, isLoading, error } = useQuery({
    ...getPostByIdQueryOptions(postId),
    enabled: !!postId,
  });

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 min-h-[50vh]">
        <div className="text-red-500">Error: {error.message}</div>
        <Link 
          href="/dashboard" 
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Back to Posts
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center gap-4 min-h-[50vh]">
        <div>Post not found</div>
        <Link 
          href="/dashboard" 
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        href="/dashboard"
        className="inline-block mb-6 text-blue-500 hover:text-blue-700 underline"
      >
        ← Back
      </Link>
      
      <article className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        </div>
      </article>
    </div>
  );
}

export default PostPage;
