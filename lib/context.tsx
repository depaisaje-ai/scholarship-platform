'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppStep, UserProfile, SearchPreferences, RecommendationReport } from './types';

const initialState: AppState = {
    currentStep: 'landing',
    profile: {},
    preferences: {},
    report: null,
    selectedProgramId: null,
};

type Action =
    | { type: 'SET_STEP'; payload: AppStep }
    | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
    | { type: 'UPDATE_PREFERENCES'; payload: Partial<SearchPreferences> }
    | { type: 'SET_REPORT'; payload: RecommendationReport }
    | { type: 'SELECT_PROGRAM'; payload: string }
    | { type: 'RESET' };

function appReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'SET_STEP':
            return { ...state, currentStep: action.payload };
        case 'UPDATE_PROFILE':
            return { ...state, profile: { ...state.profile, ...action.payload } };
        case 'UPDATE_PREFERENCES':
            return { ...state, preferences: { ...state.preferences, ...action.payload } };
        case 'SET_REPORT':
            return { ...state, report: action.payload };
        case 'SELECT_PROGRAM':
            return { ...state, selectedProgramId: action.payload };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

interface AppContextType {
    state: AppState;
    setStep: (step: AppStep) => void;
    updateProfile: (profile: Partial<UserProfile>) => void;
    updatePreferences: (preferences: Partial<SearchPreferences>) => void;
    setReport: (report: RecommendationReport) => void;
    selectProgram: (id: string) => void;
    reset: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const value: AppContextType = {
        state,
        setStep: (step) => dispatch({ type: 'SET_STEP', payload: step }),
        updateProfile: (profile) => dispatch({ type: 'UPDATE_PROFILE', payload: profile }),
        updatePreferences: (preferences) => dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences }),
        setReport: (report) => dispatch({ type: 'SET_REPORT', payload: report }),
        selectProgram: (id) => dispatch({ type: 'SELECT_PROGRAM', payload: id }),
        reset: () => dispatch({ type: 'RESET' }),
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
