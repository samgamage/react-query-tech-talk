import Spinner from "@/components/Spinner";
import UserCard from "@/components/UserCard";
import { getUsersQueryOptions } from "@/utils/queryOptions/getUsersQueryOptions";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data, isLoading, error } = useQuery(getUsersQueryOptions);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
