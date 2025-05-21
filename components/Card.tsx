import Link from 'next/link';

interface CardProps {
    id: string;
    title: string;
    content: string;
}

export default function Card({ id, title, content }: CardProps) {
    return (
        <Link href={`/posts/${id}`}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-600 line-clamp-3">{content}</p>
            </div>
        </Link>
    );
}
