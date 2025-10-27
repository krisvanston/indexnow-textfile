import {AsrListener, AsrService} from './types';

// Placeholder implementation for iOS Speech framework bridge.
// In a real app this would be implemented via a native module.
export class AppleSpeechService implements AsrService {
  private listening = false;
  async start(listener: AsrListener): Promise<void> {
    this.listening = true;
    console.warn('AppleSpeechService is a stub in this scaffold.');
    listener.onTranscript({text: '', confidence: 0, timestamp: Date.now()});
  }

  async stop(): Promise<void> {
    this.listening = false;
  }

  isListening(): boolean {
    return this.listening;
  }
}

export const appleSpeechService = new AppleSpeechService();
