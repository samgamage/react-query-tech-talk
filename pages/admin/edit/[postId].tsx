import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Post } from "@/utils/types";
import { getPost, updatePost } from "@/utils/api";
import PostSkeleton from "@/components/PostSkeleton";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EditPost() {
  const router = useRouter();
  const { postId } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId || typeof postId !== 'string') return;
      
      setIsLoading(true);
      try {
        const post = await getPost(postId);
        setFormData(post);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !postId || typeof postId !== 'string') return;

    setIsSubmitting(true);
    setError(null);

    try {
      await updatePost(postId, {
        title: formData.title,
        content: formData.content,
      });
      toast.success("Post updated successfully!");
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update post");
      toast.error("Failed to update post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-red-500 mb-4">{error}</div>
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
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 inline-flex items-center gap-2"
              aria-busy={isSubmitting}
            >
              {isSubmitting && <LoadingSpinner size="sm" />}
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