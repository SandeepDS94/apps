'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, BookOpen, Search } from 'lucide-react';

interface RecommendationProps {
    recentQuizzes: any[];
}

export default function Recommendations({ recentQuizzes }: RecommendationProps) {
    const [searches, setSearches] = useState<string[]>([]);

    useEffect(() => {
        const recent = JSON.parse(localStorage.getItem('recent_searches') || '[]');
        setSearches(recent);
    }, []);

    // Filter for quizzes with score < 70%
    const weakTopics = recentQuizzes.filter(q => (q.score / q.total_questions) < 0.7).slice(0, 3);

    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="text-yellow-400" size={24} />
                Recommended for You
            </h3>

            <div className="space-y-3">
                {/* Weak Topics */}
                {weakTopics.map((quiz, i) => (
                    <div key={`weak-${i}`} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600 hover:border-blue-500 transition-all group">
                        <div>
                            <p className="font-semibold text-lg">{quiz.topic}</p>
                            <p className="text-xs text-red-400 font-medium mt-1 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                Needs Review
                            </p>
                        </div>
                        <Link
                            href={`/study/${encodeURIComponent(quiz.topic)}`}
                            className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center gap-2 text-sm font-semibold"
                        >
                            <BookOpen size={16} />
                            Study
                        </Link>
                    </div>
                ))}

                {/* Recent Searches */}
                {searches.slice(0, 3).map((topic, i) => (
                    <div key={`search-${i}`} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600 hover:border-purple-500 transition-all group">
                        <div>
                            <p className="font-semibold text-lg">{topic}</p>
                            <p className="text-xs text-purple-400 font-medium mt-1 flex items-center gap-1">
                                <Search size={12} />
                                Based on your search
                            </p>
                        </div>
                        <Link
                            href={`/study/${encodeURIComponent(topic)}`}
                            className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-all flex items-center gap-2 text-sm font-semibold"
                        >
                            <BookOpen size={16} />
                            Study
                        </Link>
                    </div>
                ))}

                {weakTopics.length === 0 && searches.length === 0 && (
                    <div className="text-center py-6 text-gray-400">
                        <p>🎉 Great job! You're doing well.</p>
                        <p className="text-sm mt-2">Search for a topic to get recommendations!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
