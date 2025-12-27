'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Globe, DollarSign, BookOpen, Users, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { AppProvider, useApp } from '@/lib/context';
import { Region, GeographicPreferences, FinancialCriteria, AcademicConditions, PersonalConstraints } from '@/lib/types';

const regions: Region[] = ['Europe', 'North America', 'Asia', 'Latin America', 'Oceania', 'Africa', 'Middle East', 'Global'];

const popularCountries = [
    'United States', 'United Kingdom', 'Germany', 'Canada', 'Australia',
    'France', 'Netherlands', 'Switzerland', 'Japan', 'Singapore',
    'Sweden', 'Denmark', 'Belgium', 'South Korea', 'New Zealand'
];

const languages = ['English', 'German', 'French', 'Spanish', 'Arabic', 'Chinese', 'Japanese', 'Korean'];

function QuestionnaireContent() {
    const router = useRouter();
    const { state, updatePreferences, setStep } = useApp();
    const [step, setStepLocal] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    // Step 1: Geographic
    const [selectedRegions, setSelectedRegions] = useState<Region[]>(
        state.preferences.geographic?.regions || []
    );
    const [selectedCountries, setSelectedCountries] = useState<string[]>(
        state.preferences.geographic?.countries || []
    );
    const [willingToRelocate, setWillingToRelocate] = useState(
        state.preferences.geographic?.willingToRelocate ?? true
    );
    const [openToOnline, setOpenToOnline] = useState(
        state.preferences.geographic?.openToOnline ?? false
    );

    // Step 2: Financial
    const [minimumCoverage, setMinimumCoverage] = useState<'Full' | 'Partial' | 'Tuition Only' | 'Any'>(
        state.preferences.financial?.minimumCoverage || 'Full'
    );
    const [interestedInStipend, setInterestedInStipend] = useState(
        state.preferences.financial?.interestedInStipend ?? true
    );
    const [interestedInHousing, setInterestedInHousing] = useState(
        state.preferences.financial?.interestedInHousing ?? true
    );
    const [interestedInTravel, setInterestedInTravel] = useState(
        state.preferences.financial?.interestedInTravel ?? true
    );
    const [maxOutOfPocket, setMaxOutOfPocket] = useState(
        state.preferences.financial?.maxOutOfPocket || 0
    );

    // Step 3: Academic
    const [languageOfInstruction, setLanguageOfInstruction] = useState<string[]>(
        state.preferences.academic?.languageOfInstruction || ['English']
    );
    const [preferredDuration, setPreferredDuration] = useState(
        state.preferences.academic?.preferredDuration || 'Any'
    );
    const [programType, setProgramType] = useState<'Research' | 'Professional' | 'Either'>(
        state.preferences.academic?.programType || 'Either'
    );
    const [admissionTimeline, setAdmissionTimeline] = useState<'Next Intake' | 'Flexible' | 'Specific Year'>(
        state.preferences.academic?.admissionTimeline || 'Next Intake'
    );

    // Step 4: Personal
    const [visaLimitations, setVisaLimitations] = useState(
        state.preferences.personal?.visaLimitations || ''
    );
    const [workWhileStudying, setWorkWhileStudying] = useState(
        state.preferences.personal?.workWhileStudying ?? true
    );
    const [familyConsiderations, setFamilyConsiderations] = useState(
        state.preferences.personal?.familyConsiderations ?? false
    );

    const toggleRegion = (region: Region) => {
        if (selectedRegions.includes(region)) {
            setSelectedRegions(selectedRegions.filter(r => r !== region));
        } else {
            setSelectedRegions([...selectedRegions, region]);
        }
    };

    const toggleCountry = (country: string) => {
        if (selectedCountries.includes(country)) {
            setSelectedCountries(selectedCountries.filter(c => c !== country));
        } else {
            setSelectedCountries([...selectedCountries, country]);
        }
    };

    const toggleLanguage = (lang: string) => {
        if (languageOfInstruction.includes(lang)) {
            if (languageOfInstruction.length > 1) {
                setLanguageOfInstruction(languageOfInstruction.filter(l => l !== lang));
            }
        } else {
            setLanguageOfInstruction([...languageOfInstruction, lang]);
        }
    };

    const handleNext = async () => {
        // Save current step data
        switch (step) {
            case 1:
                const geographic: GeographicPreferences = {
                    regions: selectedRegions.length > 0 ? selectedRegions : ['Global'],
                    countries: selectedCountries,
                    willingToRelocate,
                    openToOnline
                };
                updatePreferences({ geographic });
                break;
            case 2:
                const financial: FinancialCriteria = {
                    minimumCoverage,
                    interestedInStipend,
                    interestedInHousing,
                    interestedInTravel,
                    maxOutOfPocket: minimumCoverage === 'Full' ? 0 : maxOutOfPocket
                };
                updatePreferences({ financial });
                break;
            case 3:
                const academic: AcademicConditions = {
                    languageOfInstruction,
                    preferredDuration,
                    programType,
                    admissionTimeline
                };
                updatePreferences({ academic });
                break;
            case 4:
                const personal: PersonalConstraints = {
                    visaLimitations,
                    workWhileStudying,
                    familyConsiderations
                };
                updatePreferences({ personal });

                // Start processing
                setIsProcessing(true);
                setStep('processing');

                // Simulate AI processing
                await new Promise(resolve => setTimeout(resolve, 3000));

                // Navigate to results
                router.push('/results');
                return;
        }
        setStepLocal(step + 1);
    };

    const handleBack = () => {
        if (step === 1) {
            router.push('/profile');
        } else {
            setStepLocal(step - 1);
        }
    };

    if (isProcessing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="relative mb-8">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
                            <Loader2 className="w-12 h-12 text-white animate-spin" />
                        </div>
                        <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-primary-500/30 animate-ping" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Finding Your Perfect Scholarships</h2>
                    <p className="text-dark-400 mb-8">
                        Our AI is analyzing 20+ scholarship programs to find the best matches for your profile...
                    </p>
                    <div className="space-y-2">
                        {[
                            'Analyzing your academic background...',
                            'Matching with scholarship requirements...',
                            'Calculating financial fit...',
                            'Ranking recommendations...'
                        ].map((text, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-dark-300 animate-in" style={{ animationDelay: `${index * 0.5}s` }}>
                                <CheckCircle className="w-4 h-4 text-primary-400" />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 animate-in">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
                                <Globe className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Geographic Preferences</h2>
                                <p className="text-dark-400">Where would you like to study?</p>
                            </div>
                        </div>

                        <div className="card space-y-4">
                            <h3 className="font-semibold text-white">Preferred Regions</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {regions.map(region => (
                                    <button
                                        key={region}
                                        onClick={() => toggleRegion(region)}
                                        className={`p-3 rounded-xl border transition-all text-sm ${selectedRegions.includes(region)
                                            ? 'bg-primary-500/20 border-primary-500 text-white'
                                            : 'border-dark-600 text-dark-300 hover:border-dark-500'
                                            }`}
                                    >
                                        {selectedRegions.includes(region) && <CheckCircle className="w-4 h-4 inline mr-1" />}
                                        {region}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="card space-y-4">
                            <h3 className="font-semibold text-white">Specific Countries (Optional)</h3>
                            <div className="flex flex-wrap gap-2">
                                {popularCountries.map(country => (
                                    <button
                                        key={country}
                                        onClick={() => toggleCountry(country)}
                                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${selectedCountries.includes(country)
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                                            }`}
                                    >
                                        {country}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="card space-y-4">
                            <h3 className="font-semibold text-white">Flexibility</h3>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={willingToRelocate}
                                    onChange={(e) => setWillingToRelocate(e.target.checked)}
                                    className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-primary-500"
                                />
                                <span className="text-dark-200">I am willing to relocate internationally</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={openToOnline}
                                    onChange={(e) => setOpenToOnline(e.target.checked)}
                                    className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-primary-500"
                                />
                                <span className="text-dark-200">I am open to online/hybrid programs</span>
                            </label>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6 animate-in">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
                                <DollarSign className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Financial Criteria</h2>
                                <p className="text-dark-400">What funding do you need?</p>
                            </div>
                        </div>

                        <div className="card space-y-4">
                            <h3 className="font-semibold text-white">Minimum Scholarship Coverage *</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {(['Full', 'Partial', 'Tuition Only', 'Any'] as const).map(coverage => (
                                    <button
                                        key={coverage}
                                        onClick={() => setMinimumCoverage(coverage)}
                                        className={`p-4 rounded-xl border transition-all text-left ${minimumCoverage === coverage
                                            ? 'bg-primary-500/20 border-primary-500'
                                            : 'border-dark-600 hover:border-dark-500'
                                            }`}
                                    >
                                        <div className={`font-medium ${minimumCoverage === coverage ? 'text-white' : 'text-dark-200'}`}>
                                            {coverage}
                                        </div>
                                        <div className="text-sm text-dark-400 mt-1">
                                            {coverage === 'Full' && 'Covers tuition + living expenses'}
                                            {coverage === 'Partial' && 'At least 50% of costs covered'}
                                            {coverage === 'Tuition Only' && 'Covers tuition fees only'}
                                            {coverage === 'Any' && 'Any financial support is welcome'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="card space-y-4">
                            <h3 className="font-semibold text-white">Additional Benefits Interest</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-dark-700/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={interestedInStipend}
                                        onChange={(e) => setInterestedInStipend(e.target.checked)}
                                        className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-primary-500"
                                    />
                                    <div>
                                        <span className="text-dark-200">Monthly Living Stipend</span>
                                        <p className="text-sm text-dark-400">Regular allowance for living expenses</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-dark-700/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={interestedInHousing}
                                        onChange={(e) => setInterestedInHousing(e.target.checked)}
                                        className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-primary-500"
                                    />
                                    <div>
                                        <span className="text-dark-200">Housing Support</span>
                                        <p className="text-sm text-dark-400">Accommodation or housing allowance</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-dark-700/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={interestedInTravel}
                                        onChange={(e) => setInterestedInTravel(e.target.checked)}
                                        className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-primary-500"
                                    />
                                    <div>
                                        <span className="text-dark-200">Travel Grant</span>
                                        <p className="text-sm text-dark-400">Airfare or relocation costs covered</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {minimumCoverage !== 'Full' && (
                            <div className="card space-y-4">
                                <h3 className="font-semibold text-white">Maximum Out-of-Pocket (Annual, USD)</h3>
                                <input
                                    type="number"
                                    value={maxOutOfPocket}
                                    onChange={(e) => setMaxOutOfPocket(parseInt(e.target.value) || 0)}
                                    placeholder="e.g., 10000"
                                    className="input-field"
                                />
                                <p className="text-sm text-dark-400">
                                    Maximum you can afford to pay per year after scholarship deductions
                                </p>
                            </div>
                        )}
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6 animate-in">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
                                <BookOpen className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Academic Conditions</h2>
                                <p className="text-dark-400">Program preferences</p>
                            </div>
                        </div>

                        <div className="card space-y-4">
                            <h3 className="font-semibold text-white">Language of Instruction</h3>
                            <div className="flex flex-wrap gap-3">
                                {languages.map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => toggleLanguage(lang)}
                                        className={`px-4 py-2 rounded-xl border transition-all ${languageOfInstruction.includes(lang)
                                            ? 'bg-primary-500/20 border-primary-500 text-white'
                                            : 'border-dark-600 text-dark-300 hover:border-dark-500'
                                            }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="card space-y-4">
                            <h3 className="font-semibold text-white">Program Duration</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['Any', '1 year', '2 years', '3+ years'].map(duration => (
                                    <button
                                        key={duration}
                                        onClick={() => setPreferredDuration(duration)}
                                        className={`p-3 rounded-xl border transition-all ${preferredDuration === duration
                                            ? 'bg-primary-500/20 border-primary-500 text-white'
                                            : 'border-dark-600 text-dark-300 hover:border-dark-500'
                                            }`}
                                    >
                                        {duration}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="card space-y-4">
                            <h3 className="font-semibold text-white">Program Type</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {(['Research', 'Professional', 'Either'] as const).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setProgramType(type)}
                                        className={`p-4 rounded-xl border transition-all text-center ${programType === type
                                            ? 'bg-primary-500/20 border-primary-500 text-white'
                                            : 'border-dark-600 text-dark-300 hover:border-dark-500'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="card space-y-4">
                            <h3 className="font-semibold text-white">Admission Timeline</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {(['Next Intake', 'Flexible', 'Specific Year'] as const).map(timeline => (
                                    <button
                                        key={timeline}
                                        onClick={() => setAdmissionTimeline(timeline)}
                                        className={`p-3 rounded-xl border transition-all ${admissionTimeline === timeline
                                            ? 'bg-primary-500/20 border-primary-500 text-white'
                                            : 'border-dark-600 text-dark-300 hover:border-dark-500'
                                            }`}
                                    >
                                        {timeline}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6 animate-in">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Personal Considerations</h2>
                                <p className="text-dark-400">Any special requirements?</p>
                            </div>
                        </div>

                        <div className="card space-y-4">
                            <h3 className="font-semibold text-white">Work While Studying</h3>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={workWhileStudying}
                                    onChange={(e) => setWorkWhileStudying(e.target.checked)}
                                    className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-primary-500"
                                />
                                <span className="text-dark-200">I want the option to work part-time while studying</span>
                            </label>
                        </div>

                        <div className="card space-y-4">
                            <h3 className="font-semibold text-white">Family Considerations</h3>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={familyConsiderations}
                                    onChange={(e) => setFamilyConsiderations(e.target.checked)}
                                    className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-primary-500"
                                />
                                <span className="text-dark-200">I have family members who may relocate with me</span>
                            </label>
                        </div>

                        <div className="card space-y-4">
                            <h3 className="font-semibold text-white">Visa Limitations (if any)</h3>
                            <textarea
                                value={visaLimitations}
                                onChange={(e) => setVisaLimitations(e.target.value)}
                                placeholder="Describe any visa restrictions or limitations you're aware of..."
                                rows={3}
                                className="input-field resize-none"
                            />
                        </div>

                        <div className="card bg-primary-500/10 border-primary-500/30">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 text-primary-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-white mb-2">Ready to Find Your Scholarships!</h4>
                                    <p className="text-dark-300 text-sm">
                                        Click &ldquo;Find Scholarships&rdquo; to start our AI-powered matching process.
                                        We&apos;ll analyze your profile against 20+ scholarship programs and provide personalized recommendations.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const stepTitles = ['Location', 'Funding', 'Program', 'Personal'];

    return (
        <div className="min-h-screen py-12 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Refine Your Search</h1>
                    <p className="text-dark-400">Help us narrow down the best scholarships for you</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-dark-400">Step {step} of 4</span>
                        <span className="text-sm text-primary-400">{Math.round((step / 4) * 100)}% Complete</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
                    </div>
                    <div className="flex justify-between mt-4">
                        {stepTitles.map((title, index) => (
                            <div
                                key={index}
                                className={`text-xs ${index + 1 <= step ? 'text-primary-400' : 'text-dark-500'}`}
                            >
                                {title}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                {renderStep()}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-700">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-white hover:bg-dark-700 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>

                    <button
                        onClick={handleNext}
                        className="btn-primary flex items-center gap-2"
                    >
                        {step === 4 ? 'Find Scholarships' : 'Next'} <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function QuestionnairePage() {
    return (
        <AppProvider>
            <QuestionnaireContent />
        </AppProvider>
    );
}
