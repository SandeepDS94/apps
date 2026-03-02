'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleProfileClick = () => {
        router.push('/settings');
    };

    const navItems = [
        { name: 'Analytics', href: '/dashboard' },
        { name: 'Notes', href: '/notes' },
        { name: 'Quiz', href: '/quiz/new' },
        { name: 'Riddles', href: '/riddles' },
        { name: 'Resources', href: '/resources' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-slate-900/60 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex justify-between items-center shadow-lg shadow-black/5">
            <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    AI Learning
                </h1>
            </div>

            <div className="flex items-center gap-8">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-sm font-medium transition-colors px-4 py-2 rounded-lg ${isActive
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {item.name}
                        </Link>
                    );
                })}

                <button
                    onClick={handleProfileClick}
                    className="text-gray-400 hover:text-white transition"
                    title="Profile & Settings"
                >
                    <User size={20} />
                </button>
            </div>
        </nav>
    );
}
