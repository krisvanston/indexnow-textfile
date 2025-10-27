import {Phrase, UserProfile} from '../../models';
import {Suggestion, SuggestionContext} from './types';
import {v4 as uuid} from 'uuid';

export interface SuggestionEngineConfig {
  personalWeight: number;
  globalWeight: number;
  cacheWeight: number;
}

const defaultConfig: SuggestionEngineConfig = {
  personalWeight: 0.55,
  globalWeight: 0.35,
  cacheWeight: 0.1
};

const normalize = (value: number, min: number, max: number) => {
  if (max === min) {
    return 0;
  }
  return (value - min) / (max - min);
};

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z\s']/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);

export class SuggestionEngine {
  private config: SuggestionEngineConfig;
  private personalPhraseBank: Map<string, Phrase> = new Map();
  private globalFallback: string[] = [
    'Can you give me a moment?',
    'I would like a glass of water.',
    'Let me think for a second.',
    'Could you repeat that?'
  ];
  private phraseCache: string[] = [];

  constructor(config: Partial<SuggestionEngineConfig> = {}) {
    this.config = {...defaultConfig, ...config};
  }

  loadPersonalPhrases(phrases: Phrase[]) {
    phrases.forEach(phrase => {
      this.personalPhraseBank.set(phrase.id, phrase);
    });
  }

  updateCache(phrase: string) {
    this.phraseCache = [phrase, ...this.phraseCache].slice(0, 20);
  }

  private rankPersonalMatches(context: SuggestionContext): Suggestion[] {
    const tokens = tokenize(context.transcript);
    if (!tokens.length) {
      return [];
    }

    const suggestions: Suggestion[] = [];
    this.personalPhraseBank.forEach(phrase => {
      const phraseTokens = tokenize(phrase.text);
      const overlap = phraseTokens.filter(token => tokens.includes(token)).length;
      if (overlap > 0 || phrase.topic === context.topic) {
        const score =
          overlap / phraseTokens.length + phrase.usage_count * 0.01 + (phrase.topic === context.topic ? 0.2 : 0);
        suggestions.push({
          id: phrase.id,
          text: phrase.text,
          score,
          source: 'personal'
        });
      }
    });
    return suggestions;
  }

  private rankCache(context: SuggestionContext): Suggestion[] {
    if (!context.pauseDetected) {
      return [];
    }
    return this.phraseCache.slice(0, 5).map((text, index) => ({
      id: `cache-${index}`,
      text,
      score: 0.5 - index * 0.05,
      source: 'cache'
    }));
  }

  private global(context: SuggestionContext): Suggestion[] {
    return this.globalFallback
      .filter(phrase => context.topic === 'General' || phrase.toLowerCase().includes(context.topic.toLowerCase()))
      .map((text, index) => ({
        id: `global-${index}`,
        text,
        score: 0.3 - index * 0.05,
        source: 'global'
      }));
  }

  rankSuggestions(context: SuggestionContext, profile: UserProfile | null): Suggestion[] {
    const personal = this.rankPersonalMatches(context);
    const cache = this.rankCache(context);
    const global = this.global(context);
    const all = [...personal, ...cache, ...global];

    if (!all.length) {
      return [
        {
          id: uuid(),
          text: 'Take your time, you are doing great.',
          score: 0.1,
          source: 'global'
        }
      ];
    }

    const scores = all.map(s => s.score);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const normalized = all.map(suggestion => ({
      ...suggestion,
      score: normalize(suggestion.score, min, max)
    }));

    const weighted = normalized.map(suggestion => {
      const weight =
        suggestion.source === 'personal'
          ? this.config.personalWeight
          : suggestion.source === 'cache'
          ? this.config.cacheWeight
          : this.config.globalWeight;
      return {
        ...suggestion,
        score: suggestion.score * weight
      };
    });

    const personalized = profile
      ? weighted.map(suggestion => ({
          ...suggestion,
          score:
            suggestion.score +
            (suggestion.source === 'personal' && profile.consent.learning ? 0.15 : 0) +
            (suggestion.source === 'cache' ? 0.05 : 0)
        }))
      : weighted;

    return personalized.sort((a, b) => b.score - a.score).slice(0, 10);
  }
}
