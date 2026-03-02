'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, ArrowLeft, BookOpen, ExternalLink, Video, FileText, MonitorPlay } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Navbar from '@/components/Navbar';

export default function StudyPage() {
    const params = useParams();
    const topic = decodeURIComponent(params.topic as string);
    const [content, setContent] = useState('');
    const [resources, setResources] = useState<{ title: string, url: string, type: string, description: string }[]>([]);
    const [loadingNotes, setLoadingNotes] = useState(true);
    const [loadingResources, setLoadingResources] = useState(true);
    const [notesError, setNotesError] = useState('');
    const [resourcesError, setResourcesError] = useState('');

    useEffect(() => {
        const fetchNotes = async () => {
            if (!topic) return;
            try {
                const res = await fetch('/api/ai/material', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic, type: 'notes' }),
                });
                if (!res.ok) throw new Error('Failed to fetch notes');
                const data = await res.json();
                if (data.content) setContent(data.content);
            } catch (error) {

                console.error('Notes Error:', error);
                setNotesError('Failed to load study notes.');
            } finally {
                setLoadingNotes(false);
            }
        };

        const fetchResources = async () => {
            if (!topic) return;
            try {
                const res = await fetch('/api/ai/resources', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic }),
                });
                if (!res.ok) throw new Error('Failed to fetch resources');
                const data = await res.json();
                if (data.resources) setResources(data.resources);
            } catch (error) {

                console.error('Resources Error:', error);
                setResourcesError('Failed to load resources.');
            } finally {
                setLoadingResources(false);
            }
        };

        if (topic) {
            fetchNotes();
            fetchResources();
        }
    }, [topic]);

    if (loadingNotes) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                <p className="text-xl animate-pulse">Generating study notes for "{topic}"...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent bg-gradient-to-br from-[#050507] via-[#0b1121] to-[#050507] text-slate-200 font-sans selection:bg-purple-500/30">
            <Navbar />
            <div className="p-6 max-w-5xl mx-auto py-12">
                <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </Link>

                <header className="mb-10 text-center md:text-left">
                    <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <BookOpen className="text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">{topic}</h1>
                    </div>
                    <p className="text-slate-400 text-lg">AI-Generated Study Notes & Resources</p>
                </header>

                <div className="bg-slate-900/40 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden prose prose-invert max-w-none prose-headings:text-slate-100 prose-p:text-slate-300 prose-strong:text-blue-400 prose-a:text-purple-400 hover:prose-a:text-purple-300">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
                    {notesError ? (
                        <p className="text-red-400 text-center py-10 bg-red-900/10 rounded-xl border border-red-500/10">{notesError}</p>
                    ) : (
                        <ReactMarkdown className="relative z-10">{content}</ReactMarkdown>
                    )}
                </div>

                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-100">
                        <MonitorPlay className="text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]" /> Recommended Resources
                    </h2>
                    {loadingResources ? (
                        <div className="flex items-center gap-3 text-slate-400 p-8 justify-center bg-slate-900/30 rounded-2xl border border-white/5">
                            <Loader2 className="w-6 h-6 animate-spin text-purple-500" /> Finding best resources...
                        </div>
                    ) : resourcesError ? (
                        <p className="text-red-400">{resourcesError}</p>
                    ) : resources.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {resources.map((resource, idx) => (
                                <a
                                    key={idx}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-6 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 hover:border-purple-500/40 hover:bg-slate-800/60 transition-all duration-300 group hover:-translate-y-1 shadow-lg hover:shadow-purple-500/10"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2 text-xs text-purple-400 font-bold uppercase tracking-wider bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                                            {resource.type === 'video' ? <Video size={14} /> : resource.type === 'course' ? <MonitorPlay size={14} /> : <FileText size={14} />}
                                            {resource.type}
                                        </div>
                                        <ExternalLink size={16} className="text-slate-500 group-hover:text-white transition" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors leading-tight">{resource.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-2 line-clamp-2">{resource.description}</p>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 italic">No specific resources found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
