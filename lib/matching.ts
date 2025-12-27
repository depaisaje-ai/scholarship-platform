import { UserProfile, SearchPreferences, ScholarshipProgram, ProgramRecommendation, MatchScore, ApplicationGuidance, TimelineEvent } from './types';
import { scholarshipPrograms } from './scholarships';

// Calculate match score for a program against user profile and preferences
export function calculateMatchScore(
    program: ScholarshipProgram,
    profile: Partial<UserProfile>,
    preferences: Partial<SearchPreferences>
): MatchScore {
    let academicFit = 0;
    let financialFeasibility = 0;
    let careerAlignment = 0;
    let acceptanceProbability = 0;
    let longTermValue = 0;

    // Academic Fit (max 100)
    // Check if program level matches desired level
    if (profile.desiredLevel && program.academicLevel.includes(profile.desiredLevel)) {
        academicFit += 30;
    }

    // Check field of study alignment
    if (profile.fieldsOfStudy && profile.fieldsOfStudy.length > 0) {
        const fieldMatch = profile.fieldsOfStudy.some(field =>
            program.fieldsOfStudy.some(pf =>
                pf.toLowerCase().includes(field.toLowerCase()) ||
                pf === 'All Fields'
            )
        );
        if (fieldMatch) academicFit += 40;
    }

    // Check language requirements
    if (profile.languages && profile.languages.length > 0) {
        const hasRequiredLanguage = profile.languages.some(lang => {
            if (program.languageOfInstruction.toLowerCase().includes(lang.name.toLowerCase())) {
                return ['Native', 'Fluent', 'Advanced'].includes(lang.proficiency);
            }
            return lang.name.toLowerCase() === 'english' &&
                ['Native', 'Fluent', 'Advanced'].includes(lang.proficiency);
        });
        if (hasRequiredLanguage) academicFit += 30;
    } else {
        academicFit += 15; // Neutral if no language info
    }

    // Financial Feasibility (max 100)
    const coverage = program.coverage;
    if (coverage.tuition) financialFeasibility += 30;
    if (coverage.livingStipend) financialFeasibility += 25;
    if (coverage.housing) financialFeasibility += 15;
    if (coverage.travel) financialFeasibility += 15;
    if (coverage.healthInsurance) financialFeasibility += 15;

    // Adjust for user's financial preferences
    if (preferences.financial) {
        if (preferences.financial.minimumCoverage === 'Full' && program.scholarshipType !== 'Full') {
            financialFeasibility -= 30;
        }
        if (preferences.financial.interestedInStipend && coverage.livingStipend) {
            financialFeasibility += 10;
        }
        if (preferences.financial.interestedInHousing && coverage.housing) {
            financialFeasibility += 10;
        }
    }
    financialFeasibility = Math.max(0, Math.min(100, financialFeasibility));

    // Career Alignment (max 100)
    if (profile.careerGoals) {
        const goals = profile.careerGoals.toLowerCase();
        const programDesc = program.description.toLowerCase() + ' ' + program.fieldsOfStudy.join(' ').toLowerCase();

        // Simple keyword matching for career alignment
        const keywords = ['research', 'academic', 'industry', 'leadership', 'development', 'international', 'business', 'technology', 'science', 'policy'];
        let matchCount = 0;
        keywords.forEach(keyword => {
            if (goals.includes(keyword) && programDesc.includes(keyword)) {
                matchCount++;
            }
        });
        careerAlignment = Math.min(100, 40 + (matchCount * 15));
    } else {
        careerAlignment = 50; // Neutral
    }

    // Check for professional experience alignment
    if (profile.professionalExperience && profile.professionalExperience.length > 0) {
        const totalYears = profile.professionalExperience.reduce((sum, exp) => sum + exp.years, 0);
        if (program.requirements.workExperience) {
            if (totalYears >= program.requirements.workExperience) {
                careerAlignment += 20;
            } else {
                careerAlignment -= 10;
            }
        } else {
            careerAlignment += 10; // Bonus for having experience when not required
        }
    }
    careerAlignment = Math.max(0, Math.min(100, careerAlignment));

    // Acceptance Probability (max 100)
    // Based on competitiveness and profile strength
    const competitivenessMap = { 'Low': 80, 'Medium': 65, 'High': 45, 'Very High': 25 };
    acceptanceProbability = competitivenessMap[program.competitiveness] || 50;

    // Adjust based on GPA if available
    if (profile.academicBackground && profile.academicBackground.length > 0) {
        const latestGPA = profile.academicBackground[0].gpa;
        if (latestGPA && program.requirements.minimumGPA) {
            if (latestGPA >= program.requirements.minimumGPA + 0.5) {
                acceptanceProbability += 15;
            } else if (latestGPA >= program.requirements.minimumGPA) {
                acceptanceProbability += 5;
            } else {
                acceptanceProbability -= 20;
            }
        }
    }
    acceptanceProbability = Math.max(0, Math.min(100, acceptanceProbability));

    // Long Term Value (max 100)
    // Based on program prestige and funding amount
    longTermValue = 50; // Base value

    // Prestige boost for known prestigious scholarships
    const prestigiousPrograms = ['erasmus', 'fulbright', 'gates', 'knight', 'chevening', 'daad', 'rhodes', 'clarendon'];
    if (prestigiousPrograms.some(p => program.scholarshipName.toLowerCase().includes(p))) {
        longTermValue += 25;
    }

    // Value based on funding amount
    if (coverage.estimatedTotalValue > 100000) longTermValue += 15;
    else if (coverage.estimatedTotalValue > 50000) longTermValue += 10;
    else if (coverage.estimatedTotalValue > 25000) longTermValue += 5;

    // Region preference alignment
    if (preferences.geographic?.regions && preferences.geographic.regions.length > 0) {
        if (preferences.geographic.regions.includes(program.region) ||
            preferences.geographic.regions.includes('Global')) {
            longTermValue += 10;
        }
    }

    longTermValue = Math.max(0, Math.min(100, longTermValue));

    // Calculate overall score
    const weights = {
        academicFit: 0.25,
        financialFeasibility: 0.25,
        careerAlignment: 0.20,
        acceptanceProbability: 0.15,
        longTermValue: 0.15
    };

    const overall = Math.round(
        academicFit * weights.academicFit +
        financialFeasibility * weights.financialFeasibility +
        careerAlignment * weights.careerAlignment +
        acceptanceProbability * weights.acceptanceProbability +
        longTermValue * weights.longTermValue
    );

    return {
        overall,
        academicFit: Math.round(academicFit),
        financialFeasibility: Math.round(financialFeasibility),
        careerAlignment: Math.round(careerAlignment),
        acceptanceProbability: Math.round(acceptanceProbability),
        longTermValue: Math.round(longTermValue)
    };
}

// Generate explanation for why a program is recommended
export function generateExplanation(
    program: ScholarshipProgram,
    score: MatchScore,
    rank: number
): string {
    const reasons: string[] = [];

    if (score.academicFit >= 80) {
        reasons.push(`Strong academic alignment with your desired field and level of study`);
    } else if (score.academicFit >= 60) {
        reasons.push(`Good match for your academic background`);
    }

    if (score.financialFeasibility >= 80) {
        reasons.push(`Excellent financial coverage including ${program.coverage.livingStipend ? 'living stipend' : 'tuition'}`);
    } else if (score.financialFeasibility >= 60) {
        reasons.push(`Solid financial support through ${program.scholarshipType.toLowerCase()} funding`);
    }

    if (score.careerAlignment >= 70) {
        reasons.push(`Aligns well with your career goals`);
    }

    if (score.acceptanceProbability >= 60) {
        reasons.push(`Reasonable acceptance probability based on your profile`);
    } else if (score.acceptanceProbability < 40) {
        reasons.push(`Highly competitive but offers exceptional value`);
    }

    if (score.longTermValue >= 70) {
        reasons.push(`High long-term value for career development`);
    }

    // Add specific program highlights
    if (program.benefits.length > 0) {
        reasons.push(`Key benefits include: ${program.benefits.slice(0, 2).join(', ')}`);
    }

    const rankText = rank === 1 ? 'Top recommendation' :
        rank <= 3 ? 'Strongly recommended' :
            'Recommended option';

    return `**${rankText}** (Score: ${score.overall}/100)\n\n${reasons.join('. ')}. ${program.description}`;
}

// Generate application guidance for a program
export function generateApplicationGuidance(program: ScholarshipProgram): ApplicationGuidance {
    const requiredDocuments: string[] = [
        'Valid passport (copy)',
        'Official academic transcripts',
        'Bachelor/Master degree certificate',
        'Curriculum Vitae (CV)',
        'Motivation/Personal statement letter',
    ];

    // Add language requirements
    if (program.requirements.languageRequirements.length > 0) {
        program.requirements.languageRequirements.forEach(req => {
            requiredDocuments.push(`${req.test} certificate (minimum ${req.minimumScore})`);
        });
    }

    // Add recommendation letters
    requiredDocuments.push('2-3 recommendation letters');

    // Add other requirements
    program.requirements.otherRequirements.forEach(req => {
        if (!requiredDocuments.some(d => d.toLowerCase().includes(req.toLowerCase()))) {
            requiredDocuments.push(req);
        }
    });

    // Research proposal for PhD
    if (program.academicLevel.includes('PhD')) {
        requiredDocuments.push('Research proposal (2-5 pages)');
    }

    // Generate timeline
    const deadline = new Date(program.applicationDeadline);
    const timeline: TimelineEvent[] = [
        {
            date: new Date(deadline.getTime() - 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            task: 'Start preparing documents and drafting motivation letter',
            priority: 'High'
        },
        {
            date: new Date(deadline.getTime() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            task: 'Request recommendation letters from professors/employers',
            priority: 'High'
        },
        {
            date: new Date(deadline.getTime() - 45 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            task: 'Take required language tests if not yet completed',
            priority: 'High'
        },
        {
            date: new Date(deadline.getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            task: 'Finalize all documents and review application',
            priority: 'High'
        },
        {
            date: new Date(deadline.getTime() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            task: 'Submit application online',
            priority: 'High'
        },
        {
            date: program.applicationDeadline,
            task: 'Application deadline - final submission',
            priority: 'High'
        },
        {
            date: program.programStartDate,
            task: 'Program start date',
            priority: 'Medium'
        }
    ];

    const scholarshipProcess = [
        `Visit the official scholarship page: ${program.scholarshipUrl}`,
        'Create an account on the application portal',
        'Complete the online application form with personal and academic details',
        'Upload all required documents in the specified formats',
        'Submit the application before the deadline',
        'Wait for shortlisting notification (typically 2-4 months)',
        'If shortlisted, prepare for interview (if required)',
        'Await final selection decision'
    ];

    const visaConsiderations = [
        `Research ${program.country} student visa requirements for your nationality`,
        'Gather required visa documents (acceptance letter, financial proof, etc.)',
        'Schedule visa interview at the nearest embassy/consulate',
        'Allow 4-8 weeks for visa processing',
        'Arrange health insurance as required by the destination country'
    ];

    const tips = [
        'Tailor your motivation letter to this specific program and scholarship',
        'Highlight how your background aligns with the program objectives',
        'Demonstrate leadership experience and community engagement',
        'Show clear career goals and how this program helps achieve them',
        'Proofread all documents multiple times before submission',
        'Request recommendation letters from people who know your work well',
        'Prepare specific examples for potential interview questions'
    ];

    const backupOptions = [
        'Apply to multiple scholarships with similar deadlines',
        'Consider partial funding options if full funding is not secured',
        'Look into teaching or research assistantships at the university',
        'Explore country-specific government funding programs',
        'Check for university-specific merit scholarships'
    ];

    return {
        requiredDocuments,
        timeline,
        scholarshipProcess,
        visaConsiderations,
        tips,
        backupOptions
    };
}

// Main matching function to find and rank programs
export function findMatchingPrograms(
    profile: Partial<UserProfile>,
    preferences: Partial<SearchPreferences>,
    limit: number = 10
): ProgramRecommendation[] {
    // Filter programs based on basic criteria
    let filteredPrograms = [...scholarshipPrograms];

    // Filter by academic level
    if (profile.desiredLevel) {
        filteredPrograms = filteredPrograms.filter(p =>
            p.academicLevel.includes(profile.desiredLevel!)
        );
    }

    // Filter by region
    if (preferences.geographic?.regions && preferences.geographic.regions.length > 0) {
        if (!preferences.geographic.regions.includes('Global')) {
            filteredPrograms = filteredPrograms.filter(p =>
                preferences.geographic!.regions.includes(p.region)
            );
        }
    }

    // Filter by country
    if (preferences.geographic?.countries && preferences.geographic.countries.length > 0) {
        filteredPrograms = filteredPrograms.filter(p =>
            preferences.geographic!.countries.some(c =>
                p.country.toLowerCase().includes(c.toLowerCase())
            )
        );
    }

    // Filter by funding type
    if (preferences.financial?.minimumCoverage === 'Full') {
        filteredPrograms = filteredPrograms.filter(p =>
            p.scholarshipType === 'Full' || p.scholarshipType === 'Fellowship'
        );
    }

    // If no programs match filters, use all programs
    if (filteredPrograms.length === 0) {
        filteredPrograms = [...scholarshipPrograms];
    }

    // Calculate scores for all programs
    const scoredPrograms = filteredPrograms.map(program => ({
        program,
        score: calculateMatchScore(program, profile, preferences)
    }));

    // Sort by overall score
    scoredPrograms.sort((a, b) => b.score.overall - a.score.overall);

    // Take top programs and create recommendations
    const recommendations: ProgramRecommendation[] = scoredPrograms
        .slice(0, limit)
        .map((item, index) => ({
            program: item.program,
            rank: index + 1,
            matchScore: item.score,
            explanation: generateExplanation(item.program, item.score, index + 1),
            applicationGuidance: generateApplicationGuidance(item.program)
        }));

    return recommendations;
}

// Generate executive summary
export function generateExecutiveSummary(
    profile: Partial<UserProfile>,
    preferences: Partial<SearchPreferences>,
    recommendations: ProgramRecommendation[]
): { profileOverview: string; searchCriteria: string; keyFindings: string[]; topRecommendation: string } {
    const profileOverview = profile.fullName
        ? `Report prepared for ${profile.fullName}, `
        : 'Report prepared for candidate ';

    const profileDetails = [
        profile.nationality ? `from ${profile.nationality}` : '',
        profile.desiredLevel ? `seeking ${profile.desiredLevel} programs` : '',
        profile.fieldsOfStudy?.length ? `in ${profile.fieldsOfStudy.join(', ')}` : ''
    ].filter(Boolean).join(', ');

    const searchCriteria = [
        preferences.geographic?.regions?.length ? `Regions: ${preferences.geographic.regions.join(', ')}` : '',
        preferences.financial?.minimumCoverage ? `Funding: ${preferences.financial.minimumCoverage} coverage preferred` : '',
        preferences.academic?.languageOfInstruction?.length ? `Language: ${preferences.academic.languageOfInstruction.join(', ')}` : ''
    ].filter(Boolean).join(' | ');

    const topRecs = recommendations.slice(0, 3);
    const keyFindings = [
        `Identified ${recommendations.length} matching scholarship programs`,
        `Top match: ${topRecs[0]?.program.scholarshipName} at ${topRecs[0]?.program.universityName} (Score: ${topRecs[0]?.matchScore.overall}/100)`,
        `Total potential funding across top 3 programs: ${topRecs.reduce((sum, r) => sum + r.program.coverage.estimatedTotalValue, 0).toLocaleString()} ${topRecs[0]?.program.coverage.currency || 'USD'}`,
        `Application deadlines range from ${topRecs.map(r => r.program.applicationDeadline).sort()[0]} to ${topRecs.map(r => r.program.applicationDeadline).sort().pop()}`
    ];

    const topRecommendation = recommendations[0]
        ? `We highly recommend the **${recommendations[0].program.scholarshipName}** at ${recommendations[0].program.universityName}. This ${recommendations[0].program.scholarshipType.toLowerCase()} scholarship offers ${recommendations[0].program.coverage.tuition ? 'full tuition coverage' : 'partial tuition support'}${recommendations[0].program.coverage.livingStipend ? ' plus a monthly living stipend' : ''}. The program aligns strongly with your profile with an overall match score of ${recommendations[0].matchScore.overall}/100.`
        : 'Unable to generate a top recommendation. Please refine your search criteria.';

    return {
        profileOverview: profileOverview + profileDetails,
        searchCriteria: searchCriteria || 'No specific criteria selected',
        keyFindings,
        topRecommendation
    };
}
