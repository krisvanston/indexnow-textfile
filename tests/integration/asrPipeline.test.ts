import {MockAsrService} from '../../src/services/asr/MockAsrService';

describe('ASR pipeline', () => {
  it('emits transcripts and final text', async () => {
    const asr = new MockAsrService();
    const partials: string[] = [];
    const finals: string[] = [];
    await asr.start({
      onTranscript: partial => {
        partials.push(partial.text);
      },
      onFinalTranscript: text => {
        finals.push(text);
      },
      onError: () => {}
    });
    await new Promise(resolve => setTimeout(resolve, 1300));
    expect(partials.length).toBeGreaterThan(0);
    expect(finals.length).toBeGreaterThan(0);
    await asr.stop();
  });
});
