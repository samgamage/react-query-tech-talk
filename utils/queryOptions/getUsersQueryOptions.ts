import { getUsers } from "@/utils/backend/getUsers";
import { queryOptions } from "@tanstack/react-query";

export const getUsersQueryOptions = queryOptions({
    queryKey: ["users"],
    queryFn: getUsers,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
});
