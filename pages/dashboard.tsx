import { getAllPosts } from "@/utils/api";
import { useEffect } from "react";
import { useState } from "react";
import Card from "@/components/Card";
import PostsListSkeleton from "@/components/PostsListSkeleton";
import { Post } from "@/utils/types";

export default function Dashboard() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const posts = await getAllPosts();
                setPosts(posts);
            } catch (error) {
                setError(error as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPosts();
    }, []);

    if (isLoading) {
        return <PostsListSkeleton />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-gray-800">Posts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Card 
                        key={post.id} 
                        id={post.id}
                        title={post.title} 
                        content={post.content} 
                    />
                ))}
            </div>
        </div>
    );
}
