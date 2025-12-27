'use client';

import Link from 'next/link';
import { GraduationCap, Search, FileText, Rocket, ArrowRight, Sparkles, Globe, DollarSign, BookOpen } from 'lucide-react';
import { AppProvider } from '@/lib/context';

function LandingContent() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <header className="relative overflow-hidden">
                {/* Background gradient orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
                <div className="absolute top-20 right-1/4 w-80 h-80 bg-accent-violet/20 rounded-full blur-3xl" />

                <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-primary">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">ScholarPath</span>
                    </div>
                    <Link href="/profile" className="btn-primary flex items-center gap-2">
                        Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                </nav>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8 animate-in">
                        <Sparkles className="w-4 h-4 text-accent-violet" />
                        <span className="text-sm text-dark-200">AI-Powered Scholarship Discovery</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-in stagger-1">
                        Find Your Perfect
                        <span className="block text-gradient">Scholarship</span>
                    </h1>

                    <p className="text-xl text-dark-300 max-w-2xl mx-auto mb-12 animate-in stagger-2">
                        Discover academic programs with scholarships and financial aid tailored to your unique profile.
                        Get personalized recommendations and step-by-step application guidance.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in stagger-3">
                        <Link href="/profile" className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2">
                            Start Your Journey <Rocket className="w-5 h-5" />
                        </Link>
                        <button className="btn-secondary text-lg px-8 py-4">
                            Learn More
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats Section */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { value: '20+', label: 'Scholarships', icon: DollarSign },
                        { value: '50+', label: 'Universities', icon: BookOpen },
                        { value: '100%', label: 'Free to Use', icon: Sparkles },
                        { value: 'Global', label: 'Coverage', icon: Globe },
                    ].map((stat, index) => (
                        <div key={index} className="card text-center hover-lift">
                            <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary-400" />
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-dark-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">Your journey to funded education in 4 simple steps</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: FileText,
                                step: '01',
                                title: 'Build Your Profile',
                                description: 'Share your academic background, experience, and goals. Upload your CV for automatic extraction.'
                            },
                            {
                                icon: Search,
                                step: '02',
                                title: 'Refine Your Search',
                                description: 'Answer targeted questions about your preferences for location, funding, and program type.'
                            },
                            {
                                icon: Sparkles,
                                step: '03',
                                title: 'AI-Powered Matching',
                                description: 'Our algorithm analyzes 20+ scholarships to find the best matches for your unique profile.'
                            },
                            {
                                icon: Rocket,
                                step: '04',
                                title: 'Apply with Guidance',
                                description: 'Get step-by-step application instructions, document checklists, and deadline reminders.'
                            }
                        ].map((feature, index) => (
                            <div key={index} className="card group relative">
                                <div className="absolute -top-4 -right-4 text-6xl font-bold text-dark-700 group-hover:text-primary-900/30 transition-colors">
                                    {feature.step}
                                </div>
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-dark-400">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Scholarships Preview */}
            <section className="py-20 px-6 bg-dark-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="section-title">Featured Scholarships</h2>
                        <p className="section-subtitle">Some of the prestigious programs in our database</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: 'Erasmus Mundus', org: 'European Commission', coverage: 'Full Funding', flag: '🇪🇺' },
                            { name: 'Fulbright Program', org: 'U.S. Department of State', coverage: 'Full Funding', flag: '🇺🇸' },
                            { name: 'Gates Cambridge', org: 'Gates Foundation', coverage: 'Full Funding', flag: '🇬🇧' },
                            { name: 'DAAD Scholarships', org: 'German Academic Exchange', coverage: 'Full Funding', flag: '🇩🇪' },
                            { name: 'Chevening', org: 'UK Government', coverage: 'Full Funding', flag: '🇬🇧' },
                            { name: 'Knight-Hennessy', org: 'Stanford University', coverage: 'Full Funding', flag: '🇺🇸' },
                        ].map((scholarship, index) => (
                            <div key={index} className="card flex items-center gap-4 hover-lift">
                                <div className="text-4xl">{scholarship.flag}</div>
                                <div>
                                    <h3 className="font-semibold text-white">{scholarship.name}</h3>
                                    <p className="text-sm text-dark-400">{scholarship.org}</p>
                                    <span className="tag mt-2">{scholarship.coverage}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="card bg-gradient-primary border-0 p-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Find Your Scholarship?
                        </h2>
                        <p className="text-lg text-white/80 mb-8">
                            Join thousands of students who have discovered their perfect funded program through ScholarPath.
                        </p>
                        <Link href="/profile" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-dark-100 transition-colors">
                            Start Now - It&apos;s Free <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-dark-700">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-primary">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">ScholarPath</span>
                    </div>
                    <p className="text-dark-400">© 2025 ScholarPath. Your path to funded education.</p>
                </div>
            </footer>
        </div>
    );
}

export default function Home() {
    return (
        <AppProvider>
            <LandingContent />
        </AppProvider>
    );
}
