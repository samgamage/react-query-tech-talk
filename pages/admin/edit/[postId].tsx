import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Post, PostFormData } from "@/utils/types";
import { updatePost } from "@/utils/api";
import PostSkeleton from "@/components/PostSkeleton";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostByIdQueryOptions, getPostsQueryOptions } from "@/utils/queryOptions";

type UpdatePostMutationPayload = { id: string; data: PostFormData };

export default function EditPost() {
  const router = useRouter();
  const postId = router.query.postId as string;
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Post | null>(null);

  // Fetch post data
  const { data: post, isLoading, error } = useQuery({
    ...getPostByIdQueryOptions(postId as string),
    enabled: !!postId
  });

  // Update form data when post is loaded
  useEffect(() => {
    if (post) {
      setFormData(post);
    }
  }, [post]);

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }: UpdatePostMutationPayload) => 
      updatePost(id, data),
    onSuccess: async () => {
      // Invalidate both the individual post and the posts list
      await queryClient.invalidateQueries({ queryKey: getPostByIdQueryOptions(postId).queryKey });
      await queryClient.invalidateQueries({ queryKey: getPostsQueryOptions.queryKey });
      toast.success("Post updated successfully!");
      router.push('/admin');
    },
    onError: () => {
      toast.error("Failed to update post. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    updatePostMutation.mutate({
      id: postId,
      data: {
        title: formData.title,
        content: formData.content,
      },
    });
  };

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-red-500 mb-4">{error.message}</div>
        <button
          onClick={() => router.push('/admin')}
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back to Admin
        </button>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-4">Post not found</div>
        <button
          onClick={() => router.push('/admin')}
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back to Admin
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster />
      <button
        onClick={() => router.push('/admin')}
        className="text-blue-500 hover:text-blue-700 mb-6 inline-block"
      >
        ← Back to Admin
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => prev ? { ...prev, title: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => prev ? { ...prev, content: e.target.value } : null)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={updatePostMutation.isPending}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 inline-flex items-center gap-2"
              aria-busy={updatePostMutation.isPending}
            >
              {updatePostMutation.isPending && <LoadingSpinner size="sm" />}
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 