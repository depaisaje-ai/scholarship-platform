'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Upload, X, FileText, User, GraduationCap, Briefcase, Globe, Target, DollarSign, CheckCircle } from 'lucide-react';
import { AppProvider, useApp } from '@/lib/context';
import { AcademicLevel, Language, AcademicBackground, ProfessionalExperience } from '@/lib/types';

const academicLevels: AcademicLevel[] = ['Bachelor', 'Master', 'PhD', 'Postgraduate', 'Certificate'];
const languageProficiencies = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'] as const;
const commonLanguages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic', 'Portuguese', 'Japanese', 'Korean', 'Russian'];

const fieldsOfStudy = [
    'Computer Science', 'Data Science', 'Artificial Intelligence', 'Engineering',
    'Business Administration', 'Economics', 'Finance', 'Public Policy',
    'Medicine', 'Public Health', 'Nursing', 'Biotechnology',
    'Law', 'International Relations', 'Political Science',
    'Environmental Science', 'Agriculture', 'Development Studies',
    'Education', 'Psychology', 'Social Work',
    'Arts & Humanities', 'Communications', 'Journalism',
    'Other'
];

function ProfileStep({ step, onNext, onBack }: { step: number; onNext: () => void; onBack: () => void }) {
    const { state, updateProfile } = useApp();
    const router = useRouter();

    // Step 1: Basic Info
    const [fullName, setFullName] = useState(state.profile.fullName || '');
    const [nationality, setNationality] = useState(state.profile.nationality || '');
    const [countryOfResidence, setCountryOfResidence] = useState(state.profile.countryOfResidence || '');

    // Step 2: Academic Background
    const [academicBackground, setAcademicBackground] = useState<AcademicBackground[]>(
        state.profile.academicBackground || [{ degree: '', institution: '', country: '', field: '', graduationYear: new Date().getFullYear() }]
    );

    // Step 3: Professional Experience
    const [professionalExperience, setProfessionalExperience] = useState<ProfessionalExperience[]>(
        state.profile.professionalExperience || []
    );

    // Step 4: Languages
    const [languages, setLanguages] = useState<Language[]>(
        state.profile.languages || [{ name: 'English', proficiency: 'Intermediate' }]
    );

    // Step 5: Goals
    const [desiredLevel, setDesiredLevel] = useState<AcademicLevel | ''>(state.profile.desiredLevel || '');
    const [selectedFields, setSelectedFields] = useState<string[]>(state.profile.fieldsOfStudy || []);
    const [careerGoals, setCareerGoals] = useState(state.profile.careerGoals || '');
    const [needsFullFunding, setNeedsFullFunding] = useState(state.profile.budgetConstraints?.needsFullFunding ?? true);
    const [maxAnnualCost, setMaxAnnualCost] = useState(state.profile.budgetConstraints?.maxAnnualCost || 0);

    // File upload state
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            // In a real app, parse the file here
            // For demo, just show the file was uploaded
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
    };

    const handleNext = () => {
        // Save current step data
        switch (step) {
            case 1:
                updateProfile({ fullName, nationality, countryOfResidence });
                break;
            case 2:
                updateProfile({ academicBackground: academicBackground.filter(ab => ab.degree && ab.institution) });
                break;
            case 3:
                updateProfile({ professionalExperience });
                break;
            case 4:
                updateProfile({ languages });
                break;
            case 5:
                updateProfile({
                    desiredLevel: desiredLevel as AcademicLevel,
                    fieldsOfStudy: selectedFields,
                    careerGoals,
                    budgetConstraints: {
                        needsFullFunding,
                        maxAnnualCost: needsFullFunding ? 0 : maxAnnualCost,
                        currency: 'USD'
                    }
                });
                // Navigate to questionnaire
                router.push('/questionnaire');
                return;
        }
        onNext();
    };

    const addAcademicEntry = () => {
        setAcademicBackground([...academicBackground, { degree: '', institution: '', country: '', field: '', graduationYear: new Date().getFullYear() }]);
    };

    const updateAcademicEntry = (index: number, field: keyof AcademicBackground, value: string | number) => {
        const updated = [...academicBackground];
        (updated[index] as Record<string, string | number | undefined>)[field] = value;
        setAcademicBackground(updated);
    };

    const addExperience = () => {
        setProfessionalExperience([...professionalExperience, { role: '', company: '', field: '', years: 1 }]);
    };

    const updateExperience = (index: number, field: keyof ProfessionalExperience, value: string | number) => {
        const updated = [...professionalExperience];
        (updated[index] as Record<string, string | number | undefined>)[field] = value;
        setProfessionalExperience(updated);
    };

    const removeExperience = (index: number) => {
        setProfessionalExperience(professionalExperience.filter((_, i) => i !== index));
    };

    const updateLanguage = (index: number, field: keyof Language, value: string) => {
        const updated = [...languages];
        (updated[index] as Record<string, string>)[field] = value;
        setLanguages(updated);
    };

    const addLanguage = () => {
        setLanguages([...languages, { name: '', proficiency: 'Intermediate' }]);
    };

    const removeLanguage = (index: number) => {
        if (languages.length > 1) {
            setLanguages(languages.filter((_, i) => i !== index));
        }
    };

    const toggleField = (field: string) => {
        if (selectedFields.includes(field)) {
            setSelectedFields(selectedFields.filter(f => f !== field));
        } else if (selectedFields.length < 5) {
            setSelectedFields([...selectedFields, field]);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 animate-in">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
                                <User className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Basic Information</h2>
                                <p className="text-dark-400">Tell us about yourself</p>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="card bg-dark-800/30 border-dashed border-2 border-dark-600 hover:border-primary-500 transition-colors">
                            <input
                                type="file"
                                accept=".pdf,.docx,.doc,.txt"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="cv-upload"
                            />
                            {uploadedFile ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-8 h-8 text-primary-400" />
                                        <div>
                                            <p className="text-white font-medium">{uploadedFile.name}</p>
                                            <p className="text-sm text-dark-400">File uploaded successfully</p>
                                        </div>
                                    </div>
                                    <button onClick={removeFile} className="p-2 hover:bg-dark-700 rounded-lg">
                                        <X className="w-5 h-5 text-dark-400" />
                                    </button>
                                </div>
                            ) : (
                                <label htmlFor="cv-upload" className="cursor-pointer block text-center py-8">
                                    <Upload className="w-12 h-12 mx-auto text-dark-400 mb-4" />
                                    <p className="text-white font-medium mb-1">Upload your CV or Resume</p>
                                    <p className="text-sm text-dark-400">PDF, DOCX, or TXT (optional)</p>
                                </label>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="input-label">Full Name (optional)</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="input-label">Nationality *</label>
                                <input
                                    type="text"
                                    value={nationality}
                                    onChange={(e) => setNationality(e.target.value)}
                                    placeholder="e.g., United States, Nigeria, India"
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="input-label">Country of Residence *</label>
                                <input
                                    type="text"
                                    value={countryOfResidence}
                                    onChange={(e) => setCountryOfResidence(e.target.value)}
                                    placeholder="e.g., United States"
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6 animate-in">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
                                <GraduationCap className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Academic Background</h2>
                                <p className="text-dark-400">Your educational history</p>
                            </div>
                        </div>

                        {academicBackground.map((edu, index) => (
                            <div key={index} className="card space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-white">Degree {index + 1}</h3>
                                    {index > 0 && (
                                        <button
                                            onClick={() => setAcademicBackground(academicBackground.filter((_, i) => i !== index))}
                                            className="text-dark-400 hover:text-red-400"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="input-label">Degree Type</label>
                                        <select
                                            value={edu.degree}
                                            onChange={(e) => updateAcademicEntry(index, 'degree', e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="">Select degree</option>
                                            <option value="High School">High School</option>
                                            <option value="Associate">Associate Degree</option>
                                            <option value="Bachelor">Bachelor&apos;s Degree</option>
                                            <option value="Master">Master&apos;s Degree</option>
                                            <option value="PhD">PhD / Doctorate</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="input-label">Field of Study</label>
                                        <input
                                            type="text"
                                            value={edu.field}
                                            onChange={(e) => updateAcademicEntry(index, 'field', e.target.value)}
                                            placeholder="e.g., Computer Science"
                                            className="input-field"
                                        />
                                    </div>

                                    <div>
                                        <label className="input-label">Institution</label>
                                        <input
                                            type="text"
                                            value={edu.institution}
                                            onChange={(e) => updateAcademicEntry(index, 'institution', e.target.value)}
                                            placeholder="University name"
                                            className="input-field"
                                        />
                                    </div>

                                    <div>
                                        <label className="input-label">Country</label>
                                        <input
                                            type="text"
                                            value={edu.country}
                                            onChange={(e) => updateAcademicEntry(index, 'country', e.target.value)}
                                            placeholder="Where you studied"
                                            className="input-field"
                                        />
                                    </div>

                                    <div>
                                        <label className="input-label">Graduation Year</label>
                                        <input
                                            type="number"
                                            value={edu.graduationYear}
                                            onChange={(e) => updateAcademicEntry(index, 'graduationYear', parseInt(e.target.value))}
                                            min={1970}
                                            max={2030}
                                            className="input-field"
                                        />
                                    </div>

                                    <div>
                                        <label className="input-label">GPA (optional, on 4.0 scale)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="4"
                                            value={edu.gpa || ''}
                                            onChange={(e) => updateAcademicEntry(index, 'gpa', parseFloat(e.target.value))}
                                            placeholder="e.g., 3.5"
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button onClick={addAcademicEntry} className="btn-secondary w-full">
                            + Add Another Degree
                        </button>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6 animate-in">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
                                <Briefcase className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Professional Experience</h2>
                                <p className="text-dark-400">Your work history (optional)</p>
                            </div>
                        </div>

                        {professionalExperience.length === 0 ? (
                            <div className="card text-center py-12">
                                <Briefcase className="w-12 h-12 mx-auto text-dark-500 mb-4" />
                                <p className="text-dark-400 mb-4">No work experience added yet</p>
                                <button onClick={addExperience} className="btn-primary">
                                    Add Experience
                                </button>
                            </div>
                        ) : (
                            <>
                                {professionalExperience.map((exp, index) => (
                                    <div key={index} className="card space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-white">Position {index + 1}</h3>
                                            <button onClick={() => removeExperience(index)} className="text-dark-400 hover:text-red-400">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="input-label">Job Title</label>
                                                <input
                                                    type="text"
                                                    value={exp.role}
                                                    onChange={(e) => updateExperience(index, 'role', e.target.value)}
                                                    placeholder="e.g., Software Engineer"
                                                    className="input-field"
                                                />
                                            </div>

                                            <div>
                                                <label className="input-label">Company</label>
                                                <input
                                                    type="text"
                                                    value={exp.company}
                                                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                                    placeholder="Company name"
                                                    className="input-field"
                                                />
                                            </div>

                                            <div>
                                                <label className="input-label">Industry/Field</label>
                                                <input
                                                    type="text"
                                                    value={exp.field}
                                                    onChange={(e) => updateExperience(index, 'field', e.target.value)}
                                                    placeholder="e.g., Technology"
                                                    className="input-field"
                                                />
                                            </div>

                                            <div>
                                                <label className="input-label">Years in Role</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={50}
                                                    value={exp.years}
                                                    onChange={(e) => updateExperience(index, 'years', parseInt(e.target.value))}
                                                    className="input-field"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button onClick={addExperience} className="btn-secondary w-full">
                                    + Add Another Position
                                </button>
                            </>
                        )}
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6 animate-in">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
                                <Globe className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Languages</h2>
                                <p className="text-dark-400">What languages do you speak?</p>
                            </div>
                        </div>

                        {languages.map((lang, index) => (
                            <div key={index} className="card">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-white">Language {index + 1}</h3>
                                    {languages.length > 1 && (
                                        <button onClick={() => removeLanguage(index)} className="text-dark-400 hover:text-red-400">
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="input-label">Language</label>
                                        <select
                                            value={lang.name}
                                            onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="">Select language</option>
                                            {commonLanguages.map(l => (
                                                <option key={l} value={l}>{l}</option>
                                            ))}
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="input-label">Proficiency Level</label>
                                        <select
                                            value={lang.proficiency}
                                            onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                                            className="input-field"
                                        >
                                            {languageProficiencies.map(p => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button onClick={addLanguage} className="btn-secondary w-full">
                            + Add Another Language
                        </button>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6 animate-in">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
                                <Target className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Goals & Preferences</h2>
                                <p className="text-dark-400">What are you looking for?</p>
                            </div>
                        </div>

                        <div className="card space-y-4">
                            <h3 className="font-semibold text-white">Desired Academic Level *</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {academicLevels.map(level => (
                                    <button
                                        key={level}
                                        onClick={() => setDesiredLevel(level)}
                                        className={`p-3 rounded-xl border transition-all ${desiredLevel === level
                                                ? 'bg-primary-500/20 border-primary-500 text-white'
                                                : 'border-dark-600 text-dark-300 hover:border-dark-500'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="card space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-white">Fields of Study *</h3>
                                <span className="text-sm text-dark-400">{selectedFields.length}/5 selected</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {fieldsOfStudy.map(field => (
                                    <button
                                        key={field}
                                        onClick={() => toggleField(field)}
                                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${selectedFields.includes(field)
                                                ? 'bg-primary-500 text-white'
                                                : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                                            }`}
                                    >
                                        {selectedFields.includes(field) && <CheckCircle className="w-3 h-3 inline mr-1" />}
                                        {field}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="card space-y-4">
                            <h3 className="font-semibold text-white">Career Goals</h3>
                            <textarea
                                value={careerGoals}
                                onChange={(e) => setCareerGoals(e.target.value)}
                                placeholder="Describe your career aspirations and how this program will help you achieve them..."
                                rows={4}
                                className="input-field resize-none"
                            />
                        </div>

                        <div className="card space-y-4">
                            <div className="flex items-center gap-4 mb-4">
                                <DollarSign className="w-8 h-8 text-primary-400" />
                                <div>
                                    <h3 className="font-semibold text-white">Financial Considerations</h3>
                                    <p className="text-sm text-dark-400">What funding do you need?</p>
                                </div>
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={needsFullFunding}
                                    onChange={(e) => setNeedsFullFunding(e.target.checked)}
                                    className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-white">I need full funding (scholarships covering all costs)</span>
                            </label>

                            {!needsFullFunding && (
                                <div>
                                    <label className="input-label">Maximum annual out-of-pocket cost (USD)</label>
                                    <input
                                        type="number"
                                        value={maxAnnualCost}
                                        onChange={(e) => setMaxAnnualCost(parseInt(e.target.value))}
                                        placeholder="e.g., 10000"
                                        className="input-field"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const isStepValid = () => {
        switch (step) {
            case 1:
                return nationality.trim() !== '' && countryOfResidence.trim() !== '';
            case 2:
                return academicBackground.some(ab => ab.degree && ab.institution);
            case 3:
                return true; // Optional
            case 4:
                return languages.some(l => l.name);
            case 5:
                return desiredLevel && selectedFields.length > 0;
            default:
                return false;
        }
    };

    return (
        <div>
            {renderStep()}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-700">
                <button
                    onClick={onBack}
                    disabled={step === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${step === 1
                            ? 'text-dark-500 cursor-not-allowed'
                            : 'text-white hover:bg-dark-700'
                        }`}
                >
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>

                <button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${isStepValid()
                            ? 'btn-primary'
                            : 'bg-dark-700 text-dark-500 cursor-not-allowed'
                        }`}
                >
                    {step === 5 ? 'Continue to Preferences' : 'Next'} <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

function ProfilePageContent() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    return (
        <div className="min-h-screen py-12 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Build Your Profile</h1>
                    <p className="text-dark-400">Help us understand your background to find the best scholarships</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-dark-400">Step {currentStep} of {totalSteps}</span>
                        <span className="text-sm text-primary-400">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
                    </div>
                    <div className="flex justify-between mt-4">
                        {['Basic Info', 'Education', 'Experience', 'Languages', 'Goals'].map((label, index) => (
                            <div
                                key={index}
                                className={`text-xs ${index + 1 <= currentStep ? 'text-primary-400' : 'text-dark-500'}`}
                            >
                                {label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <ProfileStep
                    step={currentStep}
                    onNext={() => setCurrentStep(prev => Math.min(prev + 1, totalSteps))}
                    onBack={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                />
            </div>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <AppProvider>
            <ProfilePageContent />
        </AppProvider>
    );
}
