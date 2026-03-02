'use client';

import Navbar from '@/components/Navbar';
import TopResources from '@/components/TopResources';

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Navbar />
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold mb-8 text-blue-400">Resources</h1>
                <TopResources />
            </div>
        </div>
    );
}
