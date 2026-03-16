'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Brain, Trophy, Activity } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
    const [stats, setStats] = useState({
        streak: 0,
        mastery: 0,
        quizzesTaken: 0,
        avgScore: 0
    });
    const [progressData, setProgressData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: quizzes } = await supabase
                .from('quizzes')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (quizzes && quizzes.length > 0) {
                const totalQuizzes = quizzes.length;
                const totalScore = quizzes.reduce((acc, q) => acc + (q.score / q.total_questions) * 100, 0);
                const avgScore = Math.round(totalScore / totalQuizzes);

                // Calculate streak
                const uniqueDates = Array.from(new Set(quizzes.map(q => {
                    const d = new Date(q.created_at);
                    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
                }))).sort((a, b) => b - a);

                let currentStreak = 0;
                if (uniqueDates.length > 0) {
                    const today = new Date();
                    const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
                    const oneDay = 24 * 60 * 60 * 1000;
                    
                    let checkTime = todayTime;
                    if (uniqueDates[0] === todayTime) {
                        currentStreak = 1;
                    } else if (uniqueDates[0] === todayTime - oneDay) {
                        currentStreak = 1;
                        checkTime = todayTime - oneDay;
                    }

                    if (currentStreak > 0) {
                        for (let i = 1; i < uniqueDates.length; i++) {
                            checkTime -= oneDay;
                            if (uniqueDates[i] === checkTime) {
                                currentStreak++;
                            } else {
                                break;
                            }
                        }
                    }
                }

                setStats({
                    streak: currentStreak,
                    mastery: avgScore,
                    quizzesTaken: totalQuizzes,
                    avgScore: avgScore
                });

                // Prepare Chart Data
                // Group by day to show average score per day if multiple quizzes taken
                const chartDataMap = new Map();
                for (const q of quizzes) {
                    const dateStr = new Date(q.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    const score = Math.round((q.score / q.total_questions) * 100);
                    if (chartDataMap.has(dateStr)) {
                        chartDataMap.get(dateStr).scores.push(score);
                    } else {
                        chartDataMap.set(dateStr, { day: dateStr, scores: [score] });
                    }
                }
                
                const chartData = Array.from(chartDataMap.values()).map(data => ({
                    day: data.day,
                    score: Math.round(data.scores.reduce((a: number, b: number) => a + b, 0) / data.scores.length)
                }));

                setProgressData(chartData);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-transparent bg-gradient-to-br from-[#050507] via-[#0b1121] to-[#050507] text-slate-200 font-sans selection:bg-blue-500/30">
            <Navbar />

            <main className="container mx-auto px-8 py-10">
                {/* Header */}
                <div className="mb-12 space-y-2">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
                        Analytics
                    </h1>
                    <p className="text-slate-400 text-lg font-medium tracking-wide">Focused view of your progress.</p>
                </div>

                {/* Analytics Section */}
                <div className="mb-6 flex items-center gap-3 text-slate-100">
                    <div className="p-2 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                        <Activity className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Analytics & Progress</h2>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        icon={<Trophy className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]" size={24} />}
                        label="Current Streak"
                        value={`${stats.streak} Days`}
                        trend="+1 today"
                    />
                    <StatCard
                        icon={<Brain className="text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.4)]" size={24} />}
                        label="Topic Mastery"
                        value={`${stats.mastery}%`}
                        trend="Stable"
                    />
                    <StatCard
                        icon={<BookOpen className="text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.4)]" size={24} />}
                        label="Quizzes Taken"
                        value={stats.quizzesTaken}
                        trend="Total"
                    />
                    <StatCard
                        icon={<Activity className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]" size={24} />}
                        label="Avg. Score"
                        value={`${stats.avgScore}%`}
                        trend="Overall"
                    />
                </div>

                {/* Chart Section */}
                <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="flex justify-between items-end mb-8 relative z-10">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">Performance History</h3>
                            <p className="text-slate-400 text-sm">Your quiz scores over time</p>
                        </div>
                    </div>

                    <div className="h-[400px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                    <filter id="glow" height="300%" width="300%" x="-75%" y="-75%">
                                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.4} />
                                <XAxis
                                    dataKey="day"
                                    stroke="#94a3b8"
                                    axisLine={false}
                                    tickLine={false}
                                    dy={15}
                                    tick={{ fontSize: 13, fontWeight: 500 }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    axisLine={false}
                                    tickLine={false}
                                    dx={-10}
                                    tick={{ fontSize: 13, fontWeight: 500 }}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5 5' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                        padding: '12px 16px'
                                    }}
                                    itemStyle={{ color: '#fff', fontWeight: 600 }}
                                    labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="url(#colorScore)"
                                    strokeWidth={4}
                                    dot={{ r: 4, fill: '#1e1b4b', stroke: '#818cf8', strokeWidth: 2 }}
                                    activeDot={{ r: 8, fill: '#fff', stroke: '#818cf8', strokeWidth: 3, opacity: 1 }}
                                    animationDuration={1500}
                                    filter="url(#glow)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string | number, trend?: string }) {
    return (
        <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-lg flex items-center gap-5 transition-all duration-300 hover:border-blue-500/30 hover:shadow-blue-500/10 hover:-translate-y-1 group">
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 group-hover:bg-slate-800/80 transition-colors">
                {icon}
            </div>
            <div className="flex flex-col">
                <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1 group-hover:text-slate-300 transition-colors">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
                </div>
                {trend && <span className="text-xs text-slate-500 font-medium">{trend}</span>}
            </div>
        </div>
    );
}
