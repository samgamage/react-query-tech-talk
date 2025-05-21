import { getPost, getAllPosts } from "@/utils/api";
import { queryOptions } from "@tanstack/react-query";

export const getPostsQueryOptions = queryOptions({
    queryKey: ["posts"],
    queryFn: ({ signal }) => getAllPosts({ signal }),
});

export const getPostByIdQueryOptions = (id: string) => queryOptions({
    queryKey: ["posts", id],
    queryFn: ({ signal }) => getPost(id, { signal }),
});
