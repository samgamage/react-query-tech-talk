import { useState } from "react";
import { useRouter } from "next/router";
import { Post, PostFormData } from "@/utils/types";
import { createPost, deletePost } from "@/utils/api";
import ConfirmDialog from "@/components/ConfirmDialog";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostByIdQueryOptions, getPostsQueryOptions } from "@/utils/queryOptions";

export default function AdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
  });
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  // Fetch posts using React Query
  const { data: posts = [], isLoading, error } = useQuery(getPostsQueryOptions);

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getPostsQueryOptions.queryKey });
      setFormData({ title: "", content: "" });
      toast.success("Post created successfully!");
    },
    onError: () => {
      toast.error("Failed to create post. Please try again.");
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async () => {
      const postIdToDelete = postToDelete?.id as string;
      await queryClient.invalidateQueries({ queryKey: getPostByIdQueryOptions(postIdToDelete).queryKey });
      await queryClient.invalidateQueries({ queryKey: getPostsQueryOptions.queryKey });
      setPostToDelete(null);
      toast.success("Post deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete post. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate(formData);
  };

  const handleDelete = (post: Post) => {
    setPostToDelete(post);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    deletePostMutation.mutate(postToDelete.id);
  };

  return (
    <div className="container mx-auto">
      <Toaster />
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Create Post Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error instanceof Error ? error.message : "An error occurred"}</p>}
          <button
            type="submit"
            disabled={createPostMutation.isPending}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 inline-flex items-center gap-2"
            aria-busy={createPostMutation.isPending}
          >
            {createPostMutation.isPending && <LoadingSpinner />}
            Create Post
          </button>
        </form>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Existing Posts</h2>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {posts?.map((post) => (
              <div
                key={post.id}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-start"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>
                  <p className="text-gray-500 mt-1 line-clamp-2">{post.content}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => router.push(`/admin/edit/${post.id}`)}
                    className="px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post)}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!postToDelete}
        title="Delete Post"
        message={`Are you sure you want to delete "${postToDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPostToDelete(null)}
        isLoading={deletePostMutation.isPending}
      />
    </div>
  );
} 