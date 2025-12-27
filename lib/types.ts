// User Profile Types
export interface UserProfile {
    fullName?: string;
    nationality: string;
    countryOfResidence: string;
    academicBackground: AcademicBackground[];
    professionalExperience: ProfessionalExperience[];
    languages: Language[];
    desiredLevel: AcademicLevel;
    fieldsOfStudy: string[];
    careerGoals: string;
    budgetConstraints?: BudgetConstraints;
    previousInternationalExperience?: boolean;
}

export interface AcademicBackground {
    degree: string;
    institution: string;
    country: string;
    field: string;
    gpa?: number;
    graduationYear: number;
}

export interface ProfessionalExperience {
    role: string;
    company: string;
    field: string;
    years: number;
    description?: string;
}

export interface Language {
    name: string;
    proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic';
}

export type AcademicLevel = 'Bachelor' | 'Master' | 'PhD' | 'Postgraduate' | 'Certificate';

export interface BudgetConstraints {
    maxAnnualCost?: number;
    needsFullFunding: boolean;
    currency: string;
}

// Search Preferences Types
export interface SearchPreferences {
    geographic: GeographicPreferences;
    financial: FinancialCriteria;
    academic: AcademicConditions;
    personal: PersonalConstraints;
}

export interface GeographicPreferences {
    regions: Region[];
    countries: string[];
    willingToRelocate: boolean;
    openToOnline: boolean;
}

export type Region = 'Europe' | 'North America' | 'Asia' | 'Latin America' | 'Oceania' | 'Africa' | 'Middle East' | 'Global';

export interface FinancialCriteria {
    minimumCoverage: 'Full' | 'Partial' | 'Tuition Only' | 'Any';
    interestedInStipend: boolean;
    interestedInHousing: boolean;
    interestedInTravel: boolean;
    maxOutOfPocket?: number;
}

export interface AcademicConditions {
    languageOfInstruction: string[];
    preferredDuration: string;
    programType: 'Research' | 'Professional' | 'Either';
    admissionTimeline: 'Next Intake' | 'Flexible' | 'Specific Year';
    specificYear?: number;
}

export interface PersonalConstraints {
    visaLimitations?: string;
    workWhileStudying: boolean;
    familyConsiderations: boolean;
    specialNeeds?: string;
}

// Scholarship and Program Types
export interface ScholarshipProgram {
    id: string;
    programName: string;
    universityName: string;
    country: string;
    city: string;
    region: Region;
    academicLevel: AcademicLevel[];
    fieldsOfStudy: string[];
    duration: string;
    languageOfInstruction: string;

    // Scholarship details
    scholarshipName: string;
    scholarshipType: 'Full' | 'Partial' | 'Tuition Waiver' | 'Living Stipend' | 'Fellowship';
    fundingOrganization: string;
    coverage: ScholarshipCoverage;

    // Requirements
    requirements: Requirements;

    // Deadlines and links
    applicationDeadline: string;
    programStartDate: string;
    programUrl: string;
    scholarshipUrl: string;

    // Additional info
    description: string;
    benefits: string[];
    competitiveness: 'Low' | 'Medium' | 'High' | 'Very High';
}

export interface ScholarshipCoverage {
    tuition: boolean;
    tuitionAmount?: number;
    livingStipend: boolean;
    stipendAmount?: number;
    housing: boolean;
    travel: boolean;
    travelAmount?: number;
    healthInsurance: boolean;
    estimatedTotalValue: number;
    currency: string;
}

export interface Requirements {
    minimumGPA?: number;
    requiredDegree: string[];
    workExperience?: number;
    languageRequirements: LanguageRequirement[];
    nationality?: string[];
    ageLimit?: number;
    otherRequirements: string[];
}

export interface LanguageRequirement {
    language: string;
    test: string;
    minimumScore: string;
}

// Report Types
export interface RecommendationReport {
    generatedAt: string;
    userProfile: UserProfile;
    searchPreferences: SearchPreferences;
    recommendations: ProgramRecommendation[];
    executiveSummary: ExecutiveSummary;
}

export interface ProgramRecommendation {
    program: ScholarshipProgram;
    rank: number;
    matchScore: MatchScore;
    explanation: string;
    applicationGuidance: ApplicationGuidance;
}

export interface MatchScore {
    overall: number;
    academicFit: number;
    financialFeasibility: number;
    careerAlignment: number;
    acceptanceProbability: number;
    longTermValue: number;
}

export interface ExecutiveSummary {
    profileOverview: string;
    searchCriteria: string;
    keyFindings: string[];
    topRecommendation: string;
}

export interface ApplicationGuidance {
    requiredDocuments: string[];
    timeline: TimelineEvent[];
    scholarshipProcess: string[];
    visaConsiderations: string[];
    tips: string[];
    backupOptions: string[];
}

export interface TimelineEvent {
    date: string;
    task: string;
    priority: 'High' | 'Medium' | 'Low';
}

// Application State
export type AppStep = 'landing' | 'profile' | 'questionnaire' | 'processing' | 'results' | 'guidance';

export interface AppState {
    currentStep: AppStep;
    profile: Partial<UserProfile>;
    preferences: Partial<SearchPreferences>;
    report: RecommendationReport | null;
    selectedProgramId: string | null;
}
