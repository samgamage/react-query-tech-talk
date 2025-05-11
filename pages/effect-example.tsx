import { User, getUsers } from "@/utils/backend/getUsers";
import { useEffect } from "react";
import { useState } from "react";
import UserCard from "@/components/UserCard";
import Spinner from "@/components/Spinner";

export default function EffectExample() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const users = await getUsers();
                setUsers(users);
            } catch (error) {
                setError(error as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchUsers();
    }, []);

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
            {users.map((user) => (
                <UserCard key={user.id} user={user} />
            ))}
        </div>
    );
}
