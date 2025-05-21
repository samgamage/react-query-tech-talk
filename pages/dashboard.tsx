import Card from "@/components/Card";
import PostsListSkeleton from "@/components/PostsListSkeleton";
import { useQuery } from "@tanstack/react-query";
import { getPostsQueryOptions } from "@/utils/queryOptions";

export default function Dashboard() {
    const { data, isPending, error } = useQuery(getPostsQueryOptions);

    if (isPending) {
        return <PostsListSkeleton />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-gray-800">Posts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.map((post) => (
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
