import {TriggerDetector} from '../../src/services/suggestions/TriggerDetector';

describe('TriggerDetector', () => {
  it('detects pauses beyond threshold', () => {
    const detector = new TriggerDetector({pauseThresholdMs: 800, repeatThreshold: 2});
    detector.updateTimestamp(Date.now() - 1000);
    const result = detector.evaluate(Date.now());
    expect(result.pauseDetected).toBe(true);
  });

  it('detects repeated leading phoneme', () => {
    const detector = new TriggerDetector({pauseThresholdMs: 800, repeatThreshold: 2});
    detector.updatePartial('c c c coffee');
    const result = detector.evaluate(Date.now());
    expect(result.repeatDetected).toBe(true);
  });
});
