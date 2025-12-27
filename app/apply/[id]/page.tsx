'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, CheckCircle, Circle, Calendar, FileText, Plane, Lightbulb, Shield, Clock, Award, BookOpen, Target, AlertCircle } from 'lucide-react';
import { AppProvider } from '@/lib/context';
import { scholarshipPrograms } from '@/lib/scholarships';
import { generateApplicationGuidance } from '@/lib/matching';
import { ScholarshipProgram, ApplicationGuidance } from '@/lib/types';

function ApplicationGuideContent() {
    const params = useParams();
    const programId = params.id as string;
    const [program, setProgram] = useState<ScholarshipProgram | null>(null);
    const [guidance, setGuidance] = useState<ApplicationGuidance | null>(null);
    const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());

    useEffect(() => {
        const foundProgram = scholarshipPrograms.find(p => p.id === programId);
        if (foundProgram) {
            setProgram(foundProgram);
            setGuidance(generateApplicationGuidance(foundProgram));
        }
    }, [programId]);

    const toggleDoc = (doc: string) => {
        const newChecked = new Set(checkedDocs);
        if (newChecked.has(doc)) {
            newChecked.delete(doc);
        } else {
            newChecked.add(doc);
        }
        setCheckedDocs(newChecked);
    };

    if (!program || !guidance) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto text-dark-500 mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Program Not Found</h2>
                    <p className="text-dark-400 mb-6">The scholarship program you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/results" className="btn-primary">
                        Back to Results
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/results" className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Results
                    </Link>

                    <div className="card bg-gradient-to-r from-primary-500/10 to-accent-violet/10 border-primary-500/30">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                                <Award className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-white mb-1">{program.scholarshipName}</h1>
                                <p className="text-primary-400 mb-2">{program.universityName}</p>
                                <div className="flex flex-wrap gap-4 text-sm text-dark-400">
                                    <span>{program.country}</span>
                                    <span>•</span>
                                    <span>{program.duration}</span>
                                    <span>•</span>
                                    <span>Deadline: {program.applicationDeadline}</span>
                                </div>
                            </div>
                            <a
                                href={program.scholarshipUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary flex items-center gap-2"
                            >
                                Apply Now <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Required Documents */}
                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Required Documents</h2>
                            <p className="text-sm text-dark-400">{checkedDocs.size} of {guidance.requiredDocuments.length} prepared</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="space-y-3">
                            {guidance.requiredDocuments.map((doc, index) => (
                                <label
                                    key={index}
                                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-dark-700/50 cursor-pointer transition-colors"
                                >
                                    <button
                                        onClick={() => toggleDoc(doc)}
                                        className="flex-shrink-0 mt-0.5"
                                    >
                                        {checkedDocs.has(doc) ? (
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-dark-500" />
                                        )}
                                    </button>
                                    <span className={`${checkedDocs.has(doc) ? 'text-dark-400 line-through' : 'text-white'}`}>
                                        {doc}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-dark-700">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${(checkedDocs.size / guidance.requiredDocuments.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Timeline */}
                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Application Timeline</h2>
                    </div>

                    <div className="card">
                        <div className="relative">
                            {guidance.timeline.map((event, index) => (
                                <div key={index} className="flex gap-4 pb-6 last:pb-0">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-4 h-4 rounded-full ${event.priority === 'High' ? 'bg-primary-500' : 'bg-dark-500'
                                            }`} />
                                        {index < guidance.timeline.length - 1 && (
                                            <div className="w-0.5 flex-1 bg-dark-700 mt-2" />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-sm font-medium text-primary-400">{event.date}</span>
                                            {event.priority === 'High' && (
                                                <span className="px-2 py-0.5 rounded text-xs bg-red-400/10 text-red-400">Priority</span>
                                            )}
                                        </div>
                                        <p className="text-white">{event.task}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Application Process */}
                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                            <Target className="w-5 h-5 text-primary-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Step-by-Step Process</h2>
                    </div>

                    <div className="card">
                        <ol className="space-y-4">
                            {guidance.scholarshipProcess.map((step, index) => (
                                <li key={index} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary-400">
                                        {index + 1}
                                    </div>
                                    <p className="text-dark-300 pt-1">{step}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Visa Considerations */}
                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                            <Plane className="w-5 h-5 text-primary-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Visa & Enrollment</h2>
                    </div>

                    <div className="card">
                        <ul className="space-y-3">
                            {guidance.visaConsiderations.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-accent-violet flex-shrink-0 mt-0.5" />
                                    <span className="text-dark-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Tips */}
                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                            <Lightbulb className="w-5 h-5 text-primary-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Pro Tips</h2>
                    </div>

                    <div className="card bg-gradient-to-r from-accent-violet/10 to-primary-500/10 border-accent-violet/30">
                        <ul className="space-y-3">
                            {guidance.tips.map((tip, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-dark-200">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Backup Options */}
                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-primary-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Backup Options</h2>
                    </div>

                    <div className="card">
                        <ul className="space-y-3">
                            {guidance.backupOptions.map((option, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-dark-300">{option}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* External Links */}
                <section className="mb-10">
                    <div className="card">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary-400" />
                            Official Resources
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href={program.programUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary flex items-center gap-2"
                            >
                                Program Website <ExternalLink className="w-4 h-4" />
                            </a>
                            <a
                                href={program.scholarshipUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary flex items-center gap-2"
                            >
                                Apply Now <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* Back to Results */}
                <div className="text-center">
                    <Link href="/results" className="btn-secondary inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> View Other Recommendations
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ApplicationGuidePage() {
    return (
        <AppProvider>
            <ApplicationGuideContent />
        </AppProvider>
    );
}
