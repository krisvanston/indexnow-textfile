import {SuggestionEngine} from '../../src/services/suggestions/SuggestionEngine';
import {Phrase, UserProfile} from '../../src/models';

const profile: UserProfile = {
  id: 'user-1',
  locale: 'en-US',
  consent: {learning: true, cloudFallback: false},
  pauseThresholdMs: 800,
  repeatThreshold: 2,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const phrases: Phrase[] = [
  {
    id: 'phrase-1',
    text: 'I would like a cappuccino',
    topic: 'Coffee',
    usage_count: 10,
    last_used_at: null,
    source: 'user'
  },
  {
    id: 'phrase-2',
    text: 'Can you give me a moment',
    topic: 'General',
    usage_count: 3,
    last_used_at: null,
    source: 'user'
  }
];

describe('SuggestionEngine', () => {
  it('ranks personal phrases above globals when context matches', () => {
    const engine = new SuggestionEngine({});
    engine.loadPersonalPhrases(phrases);
    const results = engine.rankSuggestions(
      {
        transcript: 'I would like to order a cappuccino please',
        topic: 'Coffee',
        recentPhrases: [],
        pauseDetected: true
      },
      profile
    );
    expect(results[0].text).toBe('I would like a cappuccino');
  });

  it('falls back to encouraging message when nothing matches', () => {
    const engine = new SuggestionEngine({});
    const results = engine.rankSuggestions(
      {
        transcript: '',
        topic: 'Unknown',
        recentPhrases: [],
        pauseDetected: false
      },
      profile
    );
    expect(results[0].text).toContain('Take your time');
  });
});
