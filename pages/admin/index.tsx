import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Post, PostFormData } from "@/utils/types";
import { createPost, getAllPosts, deletePost } from "@/utils/api";
import ConfirmDialog from "@/components/ConfirmDialog";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const newPost = await createPost(formData);
      setPosts((prevPosts) => [...prevPosts, newPost]);
      setFormData({ title: "", content: "" });
      toast.success("Post created successfully!");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create post");
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (post: Post) => {
    setPostToDelete(post);
  };

  const handleConfirmDelete = async () => {
    if (postToDelete) {
      setIsDeleting(true);
      try {
        await deletePost(postToDelete.id);
        setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postToDelete.id));
        setPostToDelete(null);
        toast.success("Post deleted successfully!");
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to delete post");
        toast.error("Failed to delete post. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
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
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 inline-flex items-center gap-2"
            aria-busy={isSubmitting}
          >
            {isSubmitting && <LoadingSpinner />}
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
        isLoading={isDeleting}
      />
    </div>
  );
} 