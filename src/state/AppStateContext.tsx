import React, {createContext, useContext, useMemo} from 'react';
import create from 'zustand';
import {UserProfile, Phrase} from '../models';
import {Suggestion} from '../services/suggestions/types';

export interface AppState {
  userProfile: UserProfile | null;
  phrases: Phrase[];
  suggestionStrip: Suggestion[];
  updateProfile: (profile: Partial<UserProfile>) => void;
  setPhrases: (phrases: Phrase[]) => void;
  setSuggestionStrip: (suggestions: Suggestion[]) => void;
}

const useStore = create<AppState>()(set => ({
  userProfile: null,
  phrases: [],
  suggestionStrip: [],
  updateProfile: profile => {
    set(state => ({
      userProfile: state.userProfile ? {...state.userProfile, ...profile} : (profile as UserProfile)
    }));
  },
  setPhrases: phrases => set({phrases}),
  setSuggestionStrip: suggestionStrip => set({suggestionStrip})
}));

const AppStateContext = createContext<AppState | null>(null);

export const AppStateProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const store = useStore();
  const value = useMemo(() => store, [store]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
