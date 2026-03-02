'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Loader2, BookOpen, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function NotesPage() {
    const [topic, setTopic] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const generateNotes = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setLoading(true);
        setNotes('');

        try {
            const res = await fetch('/api/ai/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic }),
            });
            const data = await res.json();
            if (data.notes) {
                setNotes(data.notes);
            } else {
                alert('Failed to generate notes. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans">
            <Navbar />
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-blue-400 flex items-center gap-3">
                        <BookOpen size={32} />
                        AI Study Notes
                    </h1>

                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-8 shadow-lg">
                        <form onSubmit={generateNotes} className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Enter a topic needed (e.g., Photosynthesis, WWII, Calculus...)"
                                className="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-500"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Generate Notes'}
                            </button>
                        </form>
                    </div>

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 animate-pulse">
                            <BookOpen size={48} className="mb-4 text-blue-500/50" />
                            <p className="text-xl">AI is crafting your study notes...</p>
                        </div>
                    )}

                    {notes && (
                        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                            <div className="prose prose-invert max-w-none">
                                <ReactMarkdown>{notes}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
