import { getPost, getAllPosts } from "@/utils/api";
import { queryOptions } from "@tanstack/react-query";

export const getPostsQueryOptions = queryOptions({
    queryKey: ["posts"],
    queryFn: () => getAllPosts(),
});

export const getPostByIdQueryOptions = (id: string) => queryOptions({
    queryKey: ["posts", id],
    queryFn: ({ queryKey: [, id], signal }) => getPost(id, { signal }),
    enabled: !!id,
});
