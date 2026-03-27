'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User, Settings as SettingsIcon, LogOut, Save, Loader2, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        email: '',
        full_name: '',
        grade_level: '',
        daily_goal: 2
    });
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth');
                return;
            }

            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile({
                    email: user.email || '',
                    full_name: data.full_name || '',
                    grade_level: data.grade_level || '',
                    daily_goal: data.daily_goal || 2
                });
            }
            setLoading(false);
        };
        fetchProfile();
    }, [router]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profile.full_name,
                    grade_level: profile.grade_level,
                    daily_goal: profile.daily_goal
                })
                .eq('id', user.id);

            if (error) throw error;
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            });
            if (error) throw error;
            alert('Password changed successfully!');
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/auth');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent bg-gradient-to-br from-[#050507] via-[#0b1121] to-[#050507] text-slate-200 font-sans">
            <div className="max-w-2xl mx-auto p-8">
                <Link href="/dashboard" className="flex items-center text-slate-400 hover:text-white mb-8 transition group">
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </Link>

                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Settings</h1>
                    <p className="text-slate-400 text-lg">Manage your profile and preferences</p>
                </header>

                <div className="space-y-8">
                    {/* Profile Information */}
                    <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                <User className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Profile Information</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-2 ml-1">Email</label>
                                <input
                                    type="text"
                                    value={profile.email}
                                    disabled
                                    className="w-full p-4 bg-slate-950/50 text-slate-400 rounded-xl border border-white/5 cursor-not-allowed font-mono text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-2 ml-1">Display Name</label>
                                <input
                                    type="text"
                                    value={profile.full_name}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    placeholder="Enter your name"
                                    className="w-full p-4 bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/5 text-white transition-all focus:bg-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-2 ml-1">Grade Level</label>
                                <div className="relative">
                                    <select
                                        value={profile.grade_level}
                                        onChange={(e) => setProfile({ ...profile, grade_level: e.target.value })}
                                        className="w-full p-4 bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/5 text-white appearance-none cursor-pointer hover:bg-slate-800 transition-all"
                                    >
                                        <option value="">Select grade level</option>
                                        <option value="High School">High School</option>
                                        <option value="Undergraduate">Undergraduate</option>
                                        <option value="Graduate">Graduate</option>
                                        <option value="Professional">Professional</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-2 ml-1">Daily Study Goal (hours)</label>
                                <input
                                    type="number"
                                    value={profile.daily_goal}
                                    onChange={(e) => setProfile({ ...profile, daily_goal: parseInt(e.target.value) || 0 })}
                                    min="1"
                                    max="24"
                                    className="w-full p-4 bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/5 text-white"
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 mt-4"
                            >
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Save Changes
                            </button>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-4">
                            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                <Lock className="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Change Password</h2>
                        </div>

                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-2 ml-1">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    placeholder="Enter new password"
                                    className="w-full p-4 bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/5 text-white transition-all focus:bg-slate-800"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-2 ml-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    placeholder="Confirm new password"
                                    className="w-full p-4 bg-slate-800/50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/5 text-white transition-all focus:bg-slate-800"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 mt-4"
                            >
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
                                Update Password
                            </button>
                        </form>
                    </div>

                    {/* Account Settings */}
                    <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
                        <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                <SettingsIcon className="text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]" size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Account</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl border border-green-500/10">
                                <span className="font-medium text-slate-300">Account Status</span>
                                <span className="text-green-400 text-sm font-bold bg-green-500/20 px-3 py-1 rounded-full border border-green-500/20">Active</span>
                            </div>

                            <button
                                onClick={handleSignOut}
                                className="w-full p-4 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-bold border border-red-500/10 transition-all hover:shadow-red-500/20 hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
