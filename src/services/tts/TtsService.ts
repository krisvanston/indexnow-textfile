import Tts from 'react-native-tts';

class TtsService {
  async speak(text: string, voice?: string) {
    if (!text) {
      return;
    }
    if (voice) {
      await Tts.setDefaultVoice(voice);
    }
    await Tts.speak(text);
  }

  async stop() {
    await Tts.stop();
  }
}

export const ttsService = new TtsService();
