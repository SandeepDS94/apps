'use client';

import Navbar from '@/components/Navbar';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold mb-6 text-purple-400">About Us</h1>
                <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                    Welcome to Quiz App, your ultimate destination for mastering any subject through AI-powered learning.
                    Our platform leverages cutting-edge artificial intelligence to create personalized quizzes,
                    adapt to your learning pace, and help you achieve your educational goals.
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h3 className="text-xl font-semibold mb-2 text-blue-400">Our Mission</h3>
                        <p className="text-gray-400">To make learning accessible, engaging, and effective for everyone, everywhere.</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h3 className="text-xl font-semibold mb-2 text-green-400">Our Vision</h3>
                        <p className="text-gray-400">A world where anyone can learn anything with the help of intelligent, adaptive tools.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
