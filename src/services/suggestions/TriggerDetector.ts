export interface TriggerResult {
  pauseDetected: boolean;
  repeatDetected: boolean;
  manualSignal: boolean;
}

interface TriggerDetectorOptions {
  pauseThresholdMs: number;
  repeatThreshold: number;
}

export class TriggerDetector {
  private pauseThresholdMs: number;
  private repeatThreshold: number;
  private lastSpeechTimestamp: number | null = null;
  private lastPartial: string = '';
  private manual = false;

  constructor(options: TriggerDetectorOptions) {
    this.pauseThresholdMs = options.pauseThresholdMs;
    this.repeatThreshold = options.repeatThreshold;
  }

  updateTimestamp(timestamp: number) {
    this.lastSpeechTimestamp = timestamp;
  }

  updatePartial(text: string) {
    this.lastPartial = text;
  }

  setManualSignal(signal: boolean) {
    this.manual = signal;
  }

  evaluate(now: number): TriggerResult {
    const pauseDetected =
      this.lastSpeechTimestamp !== null && now - this.lastSpeechTimestamp >= this.pauseThresholdMs;
    const repeatDetected = this.detectRepeat();
    const result: TriggerResult = {
      pauseDetected,
      repeatDetected,
      manualSignal: this.manual
    };
    this.manual = false;
    return result;
  }

  private detectRepeat(): boolean {
    if (!this.lastPartial) {
      return false;
    }
    const tokens = this.lastPartial.trim().split(/\s+/);
    if (!tokens.length) {
      return false;
    }
    const lastToken = tokens[tokens.length - 1];
    const leading = lastToken.slice(0, this.repeatThreshold);
    if (!leading) {
      return false;
    }
    const regex = new RegExp(`^${leading}+`, 'i');
    return regex.test(lastToken) && leading.length > 0;
  }
}
