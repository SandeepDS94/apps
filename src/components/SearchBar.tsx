'use client';

import { BookOpen, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        if (query.trim()) {
            // Save to local storage
            const recent = JSON.parse(localStorage.getItem('recent_searches') || '[]');
            if (!recent.includes(query.trim())) {
                localStorage.setItem('recent_searches', JSON.stringify([query.trim(), ...recent].slice(0, 5)));
            }

            router.push(`/study/${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Search className="text-blue-400" size={24} />
                Find Study Materials
            </h3>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for any topic (e.g. 'Calculus')..."
                    className="flex-1 p-3 bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                    onClick={handleSearch}
                    className="p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                    <ArrowRightIcon />
                </button>
            </div>
        </div>
    );
}

function ArrowRightIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    );
}
