import Link from 'next/link';
import { Brain, Target } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          AI Powered Personal Study Assistant For Students
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Personalized learning paths, adaptive quizzes, and smart analytics 
        </p>
        <Link
          href="/auth"
          className="inline-block px-8 py-4 bg-blue-600 rounded-full text-lg font-bold hover:bg-blue-700 transition transform hover:scale-105"
        >
          Get Started Free
        </Link>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">
        <FeatureCard
          icon={<Brain className="w-12 h-12 text-purple-500" />}
          title="AI-Powered Content"
          description="Study materials and quizzes generated instantly for any topic you choose."
        />
        <FeatureCard
          icon={<Target className="w-12 h-12 text-blue-500" />}
          title="Adaptive Learning"
          description="Questions get harder as you improve, ensuring you're always challenged."
        />

      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition">
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
