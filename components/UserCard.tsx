import { User as UserType } from "@/utils/backend/getUsers";

interface UserProps {
    user: UserType;
}

export default function UserCard({ user }: UserProps) {
    return (
        <div 
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100"
        >
            <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
            <p className="text-sm text-gray-500">ID: {user.id}</p>
        </div>
    );
} 