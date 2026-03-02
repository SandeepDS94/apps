'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

interface Question {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
    difficulty: string;
}

export default function QuizPage() {
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [amount, setAmount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [userAnswers, setUserAnswers] = useState<{ question: string, userAns: string, correctAns: string, isCorrect: boolean, explanation: string }[]>([]);
    const router = useRouter();

    const startQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/ai/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, difficulty, amount }),
            });
            const data = await res.json();
            if (data.questions) {
                setQuestions(data.questions);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to generate quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (option: string) => {
        const currentQuestion = questions[currentIndex];
        const correct = option === currentQuestion.answer;
        setSelectedOption(option);
        setIsCorrect(correct);
        if (correct) setScore(score + 1);

        setUserAnswers([...userAnswers, {
            question: currentQuestion.question,
            userAns: option,
            correctAns: currentQuestion.answer,
            isCorrect: correct,
            explanation: currentQuestion.explanation
        }]);
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setIsCorrect(null);
        } else {
            setShowResult(true);
        }
    };

    useEffect(() => {
        if (showResult) {
            const saveQuizResult = async () => {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) return;

                    await supabase.from('quizzes').insert({
                        user_id: user.id,
                        topic,
                        difficulty,
                        score,
                        total_questions: questions.length,
                        created_at: new Date().toISOString()
                    });
                } catch (error) {
                    console.error('Error saving result:', error);
                }
            };
            saveQuizResult();
        }
    }, [showResult, topic, score, questions.length]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                <p className="text-xl animate-pulse">Generating adaptive quiz for "{topic}"...</p>
            </div>
        );
    }

    if (showResult) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
                <div className="bg-gray-800 p-8 rounded-2xl max-w-4xl w-full text-center border border-gray-700 max-h-[90vh] overflow-y-auto">
                    <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
                    <div className="text-6xl font-bold text-blue-400 mb-4">
                        {Math.round((score / questions.length) * 100)}%
                    </div>
                    <p className="text-gray-400 mb-8">You got {score} out of {questions.length} correct.</p>

                    <div className="text-left space-y-6 mb-8">
                        <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Detailed Analysis</h3>
                        {userAnswers.map((ans, idx) => (
                            <div key={idx} className={`p-4 rounded-lg border ${ans.isCorrect ? 'border-green-500/30 bg-green-900/10' : 'border-red-500/30 bg-red-900/10'}`}>
                                <p className="font-medium mb-2">{idx + 1}. {ans.question}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className={ans.isCorrect ? 'text-green-400' : 'text-red-400'}>
                                        <span className="font-semibold">Your Answer:</span> {ans.userAns}
                                    </div>
                                    <div className="text-green-400">
                                        <span className="font-semibold">Correct Answer:</span> {ans.correctAns}
                                    </div>
                                </div>
                                <div className="mt-2 text-gray-300 text-sm italic">
                                    <span className="font-semibold text-blue-400">Explanation:</span> {ans.explanation}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (questions.length > 0) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
                <div className="w-full max-w-2xl mt-10">
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-gray-400">Question {currentIndex + 1}/{questions.length}</span>
                        <span className="text-blue-400 font-semibold">{topic}</span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-gray-800 p-8 rounded-2xl border border-gray-700"
                        >
                            <h3 className="text-2xl font-semibold mb-6">{questions[currentIndex].question}</h3>

                            <div className="space-y-3">
                                {questions[currentIndex].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => !selectedOption && handleAnswer(option)}
                                        disabled={!!selectedOption}
                                        className={`w-full p-4 text-left rounded-xl border transition-all ${selectedOption === option
                                            ? isCorrect
                                                ? 'bg-green-900/50 border-green-500 text-green-200'
                                                : 'bg-red-900/50 border-red-500 text-red-200'
                                            : selectedOption && option === questions[currentIndex].answer
                                                ? 'bg-green-900/50 border-green-500 text-green-200' // Show correct answer if wrong selected
                                                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span>{option}</span>
                                            {selectedOption === option && (
                                                isCorrect ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {selectedOption && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl"
                                >
                                    <h4 className="font-semibold text-blue-400 mb-2">Explanation</h4>
                                    <p className="text-gray-300">{questions[currentIndex].explanation}</p>
                                    <button
                                        onClick={nextQuestion}
                                        className="mt-4 w-full py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                    >
                                        {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight size={18} />
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent bg-gradient-to-br from-[#050507] via-[#0b1121] to-[#050507] text-slate-200 font-sans">
            <Navbar />
            <div className="flex items-center justify-center p-6 min-h-[calc(100vh-80px)]">
                <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Start New Quiz</h1>
                    <form onSubmit={startQuiz} className="space-y-5 relative z-10">
                        <div>
                            <label className="block text-sm text-slate-400 font-medium mb-2 ml-1">What do you want to learn?</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. Quantum Physics, French History..."
                                className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 font-medium mb-2 ml-1">Difficulty</label>
                            <div className="relative">
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all text-white appearance-none cursor-pointer"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 font-medium mb-2 ml-1">Number of Questions</label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                                className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all text-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2"
                        >
                            Generate Quiz <ArrowRight size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
