import {AsrListener, AsrService} from './types';

const MOCK_SENTENCES = [
  'Hi there, I am heading to the cafe',
  'Could I please get a cappuccino',
  'I need a moment to find the right word',
  'Thank you for your patience'
];

export class MockAsrService implements AsrService {
  private listening = false;
  private timer?: NodeJS.Timeout;
  private index = 0;

  async start(listener: AsrListener): Promise<void> {
    this.listening = true;
    this.index = 0;
    const emit = () => {
      if (!this.listening) {
        return;
      }
      const text = MOCK_SENTENCES[this.index % MOCK_SENTENCES.length];
      const partial = text.slice(0, Math.min(text.length, 5 + Math.random() * text.length));
      listener.onTranscript({
        text: partial,
        confidence: 0.8,
        timestamp: Date.now()
      });
      this.timer = setTimeout(() => {
        if (!this.listening) {
          return;
        }
        listener.onFinalTranscript(text);
        this.index += 1;
        emit();
      }, 1200);
    };

    emit();
  }

  async stop(): Promise<void> {
    this.listening = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  isListening(): boolean {
    return this.listening;
  }
}

export const mockAsrService = new MockAsrService();
