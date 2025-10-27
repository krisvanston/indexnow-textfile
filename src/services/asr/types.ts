export type PartialTranscript = {
  text: string;
  confidence: number;
  timestamp: number;
};

export interface AsrListener {
  onTranscript: (partial: PartialTranscript) => void;
  onFinalTranscript: (text: string) => void;
  onError: (error: Error) => void;
}

export interface AsrService {
  start: (listener: AsrListener) => Promise<void>;
  stop: () => Promise<void>;
  isListening: () => boolean;
}
