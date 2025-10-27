import {MockAsrService} from '../src/services/asr/MockAsrService';
import {SuggestionEngine} from '../src/services/suggestions/SuggestionEngine';
import {Suggestion} from '../src/services/suggestions/types';

const engine = new SuggestionEngine({});
const asr = new MockAsrService();

const runDemo = async () => {
  console.log('Starting EchoFriend demo session...');
  const suggestions: Suggestion[] = [];
  await asr.start({
    onTranscript: partial => {
      console.log(`[partial] ${partial.text}`);
    },
    onFinalTranscript: text => {
      console.log(`[final] ${text}`);
      const ranked = engine.rankSuggestions(
        {
          transcript: text,
          topic: 'General',
          recentPhrases: suggestions.map(s => s.text),
          pauseDetected: true
        },
        null
      );
      suggestions.splice(0, suggestions.length, ...ranked.slice(0, 3));
      console.log('[suggestions]', suggestions.map(s => s.text).join(' | '));
    },
    onError: error => {
      console.error('ASR error', error);
    }
  });
  await new Promise(resolve => setTimeout(resolve, 4000));
  await asr.stop();
  console.log('Demo session ended.');
};

runDemo().catch(error => {
  console.error('Demo failed', error);
  process.exitCode = 1;
});
