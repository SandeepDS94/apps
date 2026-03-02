'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Book, Video, GraduationCap, Search, Loader2 } from 'lucide-react';
import { getResourcesForTopic, Resource } from '@/lib/resources';

export default function TopResources() {
    const [topic, setTopic] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchResources = async (query: string) => {
        setLoading(true);
        try {
            const res = await fetch('/api/ai/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: query }),
            });
            const data = await res.json();
            if (data.resources) {
                setResources(data.resources);
            }
        } catch (error) {
            console.error('Failed to fetch resources', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Get the last searched topic
        const recent = JSON.parse(localStorage.getItem('recent_searches') || '[]');
        if (recent.length > 0) {
            const lastTopic = recent[0];
            setTopic(lastTopic);
            fetchResources(lastTopic);
        }
    }, []);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!searchQuery.trim()) return;

        setTopic(searchQuery);
        fetchResources(searchQuery);
        setSearchQuery('');
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'video': return <Video size={18} className="text-red-400" />;
            case 'course': return <GraduationCap size={18} className="text-green-400" />;
            default: return <Book size={18} className="text-blue-400" />;
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                    <ExternalLink className="text-purple-400" size={24} />
                    Top Resources
                </h3>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search resources..."
                        className="bg-gray-700 text-sm px-3 py-1.5 rounded-lg outline-none focus:ring-1 focus:ring-purple-500 w-40"
                    />
                    <button type="submit" className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
                        <Search size={16} className="text-gray-300" />
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex flex-col items-center py-8 text-gray-400">
                    <Loader2 className="animate-spin mb-2" size={24} />
                    <span className="text-sm">Finding best resources...</span>
                </div>
            ) : (
                <>
                    {topic && <p className="text-gray-400 text-sm mb-4">Showing results for: <span className="text-white font-medium">"{topic}"</span></p>}
                    <div className="space-y-3">
                        {resources.map((resource, idx) => (
                            <a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-600 transition">
                                        {getIcon(resource.type)}
                                    </div>
                                    <span className="font-medium text-gray-200 group-hover:text-white transition">{resource.title}</span>
                                </div>
                                <ExternalLink size={16} className="text-gray-500 group-hover:text-blue-400 transition" />
                            </a>
                        ))}
                        {resources.length === 0 && !topic && (
                            <p className="text-center text-gray-500 text-sm py-4">Search for a topic to see resources</p>
                        )}
                        {resources.length === 0 && topic && (
                            <p className="text-center text-gray-500 text-sm py-4">No resources found.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
