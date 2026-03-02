'use client';

import Navbar from '@/components/Navbar';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold mb-8 text-blue-400">Contact Us</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <p className="text-gray-300 text-lg mb-8">
                            Have questions, feedback, or need support? We'd love to hear from you.
                            Reach out to us through any of the channels below.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="bg-gray-800 p-3 rounded-lg">
                                    <Mail className="text-purple-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Email</p>
                                    <p className="font-semibold">support@quizapp.com</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="bg-gray-800 p-3 rounded-lg">
                                    <Phone className="text-green-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Phone</p>
                                    <p className="font-semibold">+1 (555) 123-4567</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="bg-gray-800 p-3 rounded-lg">
                                    <MapPin className="text-red-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Location</p>
                                    <p className="font-semibold">San Francisco, CA</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form className="bg-gray-800 p-8 rounded-xl border border-gray-700 space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Name</label>
                            <input type="text" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Your Name" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email</label>
                            <input type="email" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="your@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Message</label>
                            <textarea className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-32 focus:outline-none focus:border-blue-500" placeholder="How can we help?"></textarea>
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
