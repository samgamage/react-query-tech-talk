import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const router = useRouter();

    const navItems = [
        { href: '/effect-example', label: 'Effect Example' },
        { href: '/query-example', label: 'Query Example' },
        { href: '/mutation-example', label: 'Mutation Example' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
                <div className="flex flex-col h-full">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-800">React Query Demo</h1>
                    </div>
                    <nav className="flex-1 px-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                                    router.pathname === item.href
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="pl-64">
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
} 