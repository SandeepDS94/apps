'use client';

import { useState, useEffect } from 'react';
import { Loader2, HelpCircle, Eye, RefreshCw, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export default function RiddlesPage() {
    const [riddle, setRiddle] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchRiddle = async () => {
        setLoading(true);
        setShowAnswer(false);
        try {
            const res = await fetch('/api/ai/riddles', { cache: 'no-store' });
            const data = await res.json();
            if (data.riddle) {
                setRiddle(data.riddle);
                setAnswer(data.answer);
            }
        } catch (error) {
            console.error('Error fetching riddle:', error);
            setRiddle("Failed to load a riddle. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRiddle();
    }, []);

    return (
        <div className="min-h-screen bg-transparent bg-gradient-to-br from-[#050507] via-[#0b1121] to-[#050507] text-slate-200 font-sans">
            <Navbar />

            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">
                <div className="w-full max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900/50 backdrop-blur-xl rounded-[2rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group"
                    >
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700" />

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="mb-6 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg border border-white/5">
                                <HelpCircle size={48} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.6)]" />
                            </div>

                            <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                                Daily Brain Teaser
                            </h1>

                            <div className="min-h-[120px] flex items-center justify-center mb-8 w-full bg-slate-950/30 p-6 rounded-2xl border border-white/5">
                                {loading ? (
                                    <div className="flex flex-col items-center gap-3 text-slate-400">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                        <span>Designing a tricky one...</span>
                                    </div>
                                ) : (
                                    <p className="text-2xl md:text-3xl font-medium leading-relaxed font-serif italic text-slate-200">
                                        "{riddle}"
                                    </p>
                                )}
                            </div>

                            <AnimatePresence>
                                {showAnswer && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-8 overflow-hidden w-full"
                                    >
                                        <div className="p-6 bg-emerald-900/20 border border-emerald-500/20 rounded-2xl shadow-inner">
                                            <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-2">Answer</p>
                                            <p className="text-3xl font-bold text-white tracking-wide">{answer}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                                <button
                                    onClick={() => setShowAnswer(true)}
                                    disabled={loading || showAnswer}
                                    className="flex-1 py-4 px-6 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold transition-all border border-white/5 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                                >
                                    <Eye size={20} />
                                    Reveal Answer
                                </button>
                                <button
                                    onClick={fetchRiddle}
                                    disabled={loading}
                                    className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold transition-all shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                                    New Riddle
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
