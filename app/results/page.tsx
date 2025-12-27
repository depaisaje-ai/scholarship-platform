'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ExternalLink, Award, Calendar, MapPin, DollarSign, TrendingUp, ChevronDown, ChevronUp, BookOpen, Target, CheckCircle, Clock, Download, GraduationCap } from 'lucide-react';
import { AppProvider, useApp } from '@/lib/context';
import { findMatchingPrograms, generateExecutiveSummary } from '@/lib/matching';
import { ProgramRecommendation, MatchScore } from '@/lib/types';

function ScoreBar({ score, label, color = 'primary' }: { score: number; label: string; color?: string }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="text-dark-400">{label}</span>
                <span className="text-white font-medium">{score}%</span>
            </div>
            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${color === 'primary' ? 'bg-gradient-primary' : 'bg-gradient-accent'
                        }`}
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
}

function ProgramCard({ recommendation, rank }: { recommendation: ProgramRecommendation; rank: number }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { program, matchScore } = recommendation;

    const getCoverageText = () => {
        const parts = [];
        if (program.coverage.tuition) parts.push('Tuition');
        if (program.coverage.livingStipend) parts.push('Stipend');
        if (program.coverage.housing) parts.push('Housing');
        if (program.coverage.travel) parts.push('Travel');
        return parts.join(' + ') || 'Various';
    };

    const getCompetitivenessColor = () => {
        switch (program.competitiveness) {
            case 'Low': return 'text-green-400 bg-green-400/10';
            case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
            case 'High': return 'text-orange-400 bg-orange-400/10';
            case 'Very High': return 'text-red-400 bg-red-400/10';
        }
    };

    return (
        <div className={`card transition-all duration-300 ${rank === 1 ? 'ring-2 ring-primary-500 bg-primary-500/5' : ''}`}>
            <div className="flex items-start gap-4">
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                    <div className={`score-badge ${rank === 1 ? '' : 'bg-dark-700'}`}>
                        #{rank}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">{program.programName}</h3>
                            <p className="text-primary-400">{program.universityName}</p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-dark-400">
                                <MapPin className="w-4 h-4" />
                                <span>{program.city}, {program.country}</span>
                                <span className="text-dark-600">•</span>
                                <Clock className="w-4 h-4" />
                                <span>{program.duration}</span>
                            </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                            <div className="text-3xl font-bold text-white">{matchScore.overall}</div>
                            <div className="text-sm text-dark-400">Match Score</div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="tag">{program.scholarshipType} Funding</span>
                        <span className="tag">{getCoverageText()}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCompetitivenessColor()}`}>
                            {program.competitiveness} Competition
                        </span>
                    </div>

                    {/* Score Breakdown */}
                    <div className="grid md:grid-cols-5 gap-3 mb-4">
                        <ScoreBar score={matchScore.academicFit} label="Academic" />
                        <ScoreBar score={matchScore.financialFeasibility} label="Financial" />
                        <ScoreBar score={matchScore.careerAlignment} label="Career" />
                        <ScoreBar score={matchScore.acceptanceProbability} label="Acceptance" />
                        <ScoreBar score={matchScore.longTermValue} label="Value" />
                    </div>

                    {/* Financial Summary */}
                    <div className="flex flex-wrap gap-6 p-4 rounded-xl bg-dark-800/50 mb-4">
                        <div>
                            <div className="text-sm text-dark-400">Estimated Value</div>
                            <div className="text-lg font-semibold text-white">
                                {program.coverage.estimatedTotalValue.toLocaleString()} {program.coverage.currency}
                            </div>
                        </div>
                        {program.coverage.livingStipend && program.coverage.stipendAmount && (
                            <div>
                                <div className="text-sm text-dark-400">Monthly Stipend</div>
                                <div className="text-lg font-semibold text-white">
                                    {program.coverage.stipendAmount.toLocaleString()} {program.coverage.currency}
                                </div>
                            </div>
                        )}
                        <div>
                            <div className="text-sm text-dark-400">Deadline</div>
                            <div className="text-lg font-semibold text-white">{program.applicationDeadline}</div>
                        </div>
                    </div>

                    {/* Expandable Details */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                    >
                        {isExpanded ? 'Show Less' : 'Show Details'}
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-dark-700 space-y-4 animate-in">
                            <div>
                                <h4 className="font-semibold text-white mb-2">Description</h4>
                                <p className="text-dark-300">{program.description}</p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">Benefits</h4>
                                <ul className="space-y-1">
                                    {program.benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-center gap-2 text-dark-300">
                                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">Requirements</h4>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {program.requirements.minimumGPA && (
                                        <div className="text-dark-300">
                                            <span className="text-dark-400">Min GPA:</span> {program.requirements.minimumGPA}
                                        </div>
                                    )}
                                    {program.requirements.workExperience && (
                                        <div className="text-dark-300">
                                            <span className="text-dark-400">Work Experience:</span> {program.requirements.workExperience}+ years
                                        </div>
                                    )}
                                    {program.requirements.languageRequirements.map((req, index) => (
                                        <div key={index} className="text-dark-300">
                                            <span className="text-dark-400">{req.test}:</span> {req.minimumScore}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={program.programUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <BookOpen className="w-4 h-4" /> Program Page
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                                <a
                                    href={program.scholarshipUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary flex items-center gap-2"
                                >
                                    <Award className="w-4 h-4" /> Scholarship Page
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                                <Link
                                    href={`/apply/${program.id}`}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <Target className="w-4 h-4" /> Application Guide
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ComparisonTable({ recommendations }: { recommendations: ProgramRecommendation[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-dark-700">
                        <th className="px-4 py-3 text-sm font-semibold text-dark-300">Rank</th>
                        <th className="px-4 py-3 text-sm font-semibold text-dark-300">Program</th>
                        <th className="px-4 py-3 text-sm font-semibold text-dark-300">Country</th>
                        <th className="px-4 py-3 text-sm font-semibold text-dark-300">Coverage</th>
                        <th className="px-4 py-3 text-sm font-semibold text-dark-300">Value</th>
                        <th className="px-4 py-3 text-sm font-semibold text-dark-300">Competition</th>
                        <th className="px-4 py-3 text-sm font-semibold text-dark-300">Match</th>
                        <th className="px-4 py-3 text-sm font-semibold text-dark-300">Deadline</th>
                    </tr>
                </thead>
                <tbody>
                    {recommendations.map((rec, index) => (
                        <tr key={rec.program.id} className="border-b border-dark-800 hover:bg-dark-800/50 transition-colors">
                            <td className="px-4 py-4">
                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${index === 0 ? 'bg-gradient-primary text-white' : 'bg-dark-700 text-dark-300'
                                    }`}>
                                    {index + 1}
                                </span>
                            </td>
                            <td className="px-4 py-4">
                                <div className="font-medium text-white">{rec.program.scholarshipName}</div>
                                <div className="text-sm text-dark-400">{rec.program.universityName}</div>
                            </td>
                            <td className="px-4 py-4 text-dark-300">{rec.program.country}</td>
                            <td className="px-4 py-4">
                                <span className="tag">{rec.program.scholarshipType}</span>
                            </td>
                            <td className="px-4 py-4 text-white font-medium">
                                {rec.program.coverage.estimatedTotalValue.toLocaleString()} {rec.program.coverage.currency}
                            </td>
                            <td className="px-4 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${rec.program.competitiveness === 'Low' ? 'text-green-400 bg-green-400/10' :
                                        rec.program.competitiveness === 'Medium' ? 'text-yellow-400 bg-yellow-400/10' :
                                            rec.program.competitiveness === 'High' ? 'text-orange-400 bg-orange-400/10' :
                                                'text-red-400 bg-red-400/10'
                                    }`}>
                                    {rec.program.competitiveness}
                                </span>
                            </td>
                            <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-12 h-2 bg-dark-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-primary rounded-full"
                                            style={{ width: `${rec.matchScore.overall}%` }}
                                        />
                                    </div>
                                    <span className="text-white font-medium">{rec.matchScore.overall}</span>
                                </div>
                            </td>
                            <td className="px-4 py-4 text-dark-300 text-sm">{rec.program.applicationDeadline}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ResultsContent() {
    const { state } = useApp();
    const [recommendations, setRecommendations] = useState<ProgramRecommendation[]>([]);
    const [summary, setSummary] = useState<ReturnType<typeof generateExecutiveSummary> | null>(null);
    const [activeView, setActiveView] = useState<'cards' | 'table'>('cards');

    useEffect(() => {
        // Generate recommendations based on profile and preferences
        const recs = findMatchingPrograms(state.profile, state.preferences, 8);
        setRecommendations(recs);

        if (recs.length > 0) {
            const execSummary = generateExecutiveSummary(state.profile, state.preferences, recs);
            setSummary(execSummary);
        }
    }, [state.profile, state.preferences]);

    if (recommendations.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <GraduationCap className="w-16 h-16 mx-auto text-dark-500 mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-4">No Recommendations Yet</h2>
                    <p className="text-dark-400 mb-8">
                        Complete your profile and preferences to get personalized scholarship recommendations.
                    </p>
                    <Link href="/profile" className="btn-primary">
                        Start Now <ArrowRight className="w-4 h-4 inline ml-2" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/questionnaire" className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Preferences
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-4">Your Scholarship Recommendations</h1>
                    <p className="text-dark-400">Personalized matches based on your profile and preferences</p>
                </div>

                {/* Executive Summary */}
                {summary && (
                    <div className="card mb-8 bg-gradient-to-r from-primary-500/10 to-accent-violet/10 border-primary-500/30">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-white mb-3">Executive Summary</h2>
                                <p className="text-dark-300 mb-4">{summary.profileOverview}</p>
                                <p className="text-dark-300 mb-4">{summary.topRecommendation}</p>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {summary.keyFindings.map((finding, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm text-dark-300">
                                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                            {finding}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Toggle */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-dark-400">Found</span>
                        <span className="text-white font-semibold">{recommendations.length} scholarships</span>
                        <span className="text-dark-400">matching your profile</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveView('cards')}
                            className={`px-4 py-2 rounded-lg transition-colors ${activeView === 'cards' ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-white'
                                }`}
                        >
                            Cards
                        </button>
                        <button
                            onClick={() => setActiveView('table')}
                            className={`px-4 py-2 rounded-lg transition-colors ${activeView === 'table' ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-white'
                                }`}
                        >
                            Compare
                        </button>
                    </div>
                </div>

                {/* Content */}
                {activeView === 'cards' ? (
                    <div className="space-y-6">
                        {recommendations.map((rec, index) => (
                            <ProgramCard key={rec.program.id} recommendation={rec} rank={index + 1} />
                        ))}
                    </div>
                ) : (
                    <div className="card overflow-hidden">
                        <ComparisonTable recommendations={recommendations} />
                    </div>
                )}

                {/* Actions */}
                <div className="mt-12 text-center">
                    <div className="card inline-block">
                        <h3 className="text-lg font-semibold text-white mb-4">Ready to Apply?</h3>
                        <p className="text-dark-400 mb-6">
                            Click on any program above to view detailed application guidance, required documents, and deadlines.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="btn-secondary flex items-center gap-2">
                                <Download className="w-4 h-4" /> Export Report
                            </button>
                            <Link href="/profile" className="btn-primary flex items-center gap-2">
                                Refine Search <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResultsPage() {
    return (
        <AppProvider>
            <ResultsContent />
        </AppProvider>
    );
}
