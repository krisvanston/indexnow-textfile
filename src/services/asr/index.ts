import {AsrService} from './types';
import {mockAsrService} from './MockAsrService';
import {appleSpeechService} from './AppleSpeechService';

let currentService: AsrService = mockAsrService;

export const useAsrService = (useMock = true): AsrService => {
  currentService = useMock ? mockAsrService : appleSpeechService;
  return currentService;
};

export const getCurrentAsrService = () => currentService;
