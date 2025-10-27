export interface Suggestion {
  id: string;
  text: string;
  score: number;
  source: 'personal' | 'global' | 'cache';
}

export interface SuggestionContext {
  transcript: string;
  topic: string;
  recentPhrases: string[];
  pauseDetected: boolean;
}
