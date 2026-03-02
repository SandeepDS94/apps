'use client';

import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export default function RecentQuizzesPage() {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('quizzes')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setQuizzes(data);
            setLoading(false);
        };
        fetchQuizzes();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold mb-8 text-purple-400 flex items-center gap-3">
                    <Clock size={40} />
                    Recent Quizzes
                </h1>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzes.length > 0 ? (
                            quizzes.map((quiz) => (
                                <div key={quiz.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-semibold capitalize">{quiz.topic}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${(quiz.score / quiz.total_questions) >= 0.7
                                                ? 'bg-green-900 text-green-300'
                                                : 'bg-red-900 text-red-300'
                                            }`}>
                                            {Math.round((quiz.score / quiz.total_questions) * 100)}%
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-gray-400 text-sm mb-4">
                                        <div className="flex justify-between">
                                            <span>Score:</span>
                                            <span className="text-white font-medium">{quiz.score} / {quiz.total_questions}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Date:</span>
                                            <span className="text-white font-medium">{new Date(quiz.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        {(quiz.score / quiz.total_questions) >= 0.7 ? (
                                            <div className="flex items-center gap-1 text-green-400">
                                                <CheckCircle size={16} />
                                                <span>Passed</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-red-400">
                                                <XCircle size={16} />
                                                <span>Needs Improvement</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                <p className="text-xl">No quizzes taken yet.</p>
                                <p className="mt-2">Start a new quiz to see your history here!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
