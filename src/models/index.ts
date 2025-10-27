export type ConsentFlags = {
  learning: boolean;
  cloudFallback: boolean;
  dataExportedAt?: string;
};

export interface UserProfile {
  id: string;
  locale: string;
  consent: ConsentFlags;
  pauseThresholdMs: number;
  repeatThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export type PhraseSource = 'user' | 'system';

export interface Phrase {
  id: string;
  text: string;
  topic: string;
  usage_count: number;
  last_used_at: string | null;
  source: PhraseSource;
}

export interface AudioSample {
  id: string;
  path: string;
  duration: number;
  transcript: string;
}

export interface SessionEvent {
  id: string;
  type: 'pause_started' | 'pause_ended' | 'suggestion_shown' | 'suggestion_accepted' | 'text';
  payload?: string;
  ts: string;
}

export interface Session {
  id: string;
  started_at: string;
  ended_at?: string;
  topic: string;
  events: SessionEvent[];
}
