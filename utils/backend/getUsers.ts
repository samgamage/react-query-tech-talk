export type User = {
    id: number;
    name: string;
};

export const getUsers: () => Promise<User[]> = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    return response.json();
};
