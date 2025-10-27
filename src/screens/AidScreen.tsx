import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import TranscriptView from '../components/TranscriptView';
import SuggestionStrip from '../components/SuggestionStrip';
import LargeTextCard from '../components/LargeTextCard';
import MicControl from '../components/MicControl';
import TopicSelector from '../components/TopicSelector';
import {useAppState} from '../state/AppStateContext';
import {useAsrService} from '../services/asr';
import {AsrListener} from '../services/asr/types';
import {SuggestionEngine} from '../services/suggestions/SuggestionEngine';
import {TriggerDetector} from '../services/suggestions/TriggerDetector';
import {Suggestion} from '../services/suggestions/types';
import {ttsService} from '../services/tts/TtsService';
import {database} from '../services/storage/Database';
import {nowIso} from '../utils/time';
import {Phrase} from '../models';

const topics = ['General', 'Coffee', 'GP visit', 'Meeting', 'Family'];

const AidScreen: React.FC = () => {
  const {setSuggestionStrip, suggestionStrip, userProfile, setPhrases} = useAppState();
  const [transcript, setTranscript] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [listening, setListening] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [topic, setTopic] = useState('General');
  const engine = useMemo(() => new SuggestionEngine({}), []);
  const triggerDetector = useMemo(
    () =>
      new TriggerDetector({
        pauseThresholdMs: userProfile?.pauseThresholdMs ?? 800,
        repeatThreshold: userProfile?.repeatThreshold ?? 2
      }),
    [userProfile]
  );
  const asr = useAsrService(true);
  const intervalRef = useRef<NodeJS.Timeout>();
  const transcriptRef = useRef('');
  const suggestionsRef = useRef<Suggestion[]>([]);

  useEffect(() => {
    suggestionsRef.current = suggestionStrip;
  }, [suggestionStrip]);

  useEffect(() => {
    database.init().catch(err => console.error('Failed to init database', err));
    database.getPhrases().then(engine.loadPersonalPhrases.bind(engine));
  }, [engine]);

  useEffect(() => {
    let mounted = true;
    database.getPhrases().then(phrases => {
      if (mounted) {
        setPhrases(phrases);
      }
    });
    return () => {
      mounted = false;
    };
  }, [setPhrases]);

  const startListening = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    const listener: AsrListener = {
      onTranscript: partial => {
        setTranscript(partial.text);
        transcriptRef.current = partial.text;
        triggerDetector.updatePartial(partial.text);
        triggerDetector.updateTimestamp(partial.timestamp);
      },
      onFinalTranscript: async text => {
        setTranscript(text);
        transcriptRef.current = text;
        triggerDetector.updateTimestamp(Date.now());
        engine.updateCache(text);
        const updatedPhrases: Phrase[] = suggestionsRef.current.map(s => ({
          id: s.id,
          text: s.text,
          topic,
          usage_count: 1,
          last_used_at: nowIso(),
          source: s.source === 'personal' ? 'user' : 'system'
        }));
        for (const phrase of updatedPhrases) {
          await database.upsertPhrase(phrase);
        }
      },
      onError: error => {
        console.error('ASR error', error);
        Alert.alert('Speech error', error.message);
      }
    };
    await asr.start(listener);
    setListening(true);
    intervalRef.current = setInterval(() => {
      const trigger = triggerDetector.evaluate(Date.now());
      if (trigger.pauseDetected || trigger.repeatDetected || trigger.manualSignal) {
        const suggestions = engine.rankSuggestions(
          {
            transcript: transcriptRef.current,
            topic,
            recentPhrases: suggestionsRef.current.map(s => s.text),
            pauseDetected: trigger.pauseDetected || trigger.manualSignal
          },
          userProfile
        );
        setSuggestionStrip(suggestions);
      }
    }, 300);
  }, [asr, engine, setSuggestionStrip, topic, triggerDetector, userProfile]);

  const stopListening = useCallback(async () => {
    await asr.stop();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    setListening(false);
  }, [asr]);

  const toggleListening = useCallback(() => {
    if (asr.isListening()) {
      stopListening();
    } else {
      startListening();
    }
  }, [asr, startListening, stopListening]);

  const handleSelectSuggestion = useCallback(
    async (suggestion: Suggestion) => {
      setSelectedText(suggestion.text);
      engine.updateCache(suggestion.text);
      triggerDetector.updateTimestamp(Date.now());
      try {
        await database.upsertPhrase({
          id: suggestion.id,
          text: suggestion.text,
          topic,
          usage_count: 1,
          last_used_at: nowIso(),
          source: suggestion.source === 'personal' ? 'user' : 'system'
        });
      } catch (error) {
        console.warn('Failed to persist phrase', error);
      }
    },
    [engine, topic, triggerDetector]
  );

  const handleSpeak = useCallback(async () => {
    await ttsService.speak(selectedText);
  }, [selectedText]);

  const handleQuickHide = useCallback(() => {
    setSelectedText('');
    setTranscript('');
    transcriptRef.current = '';
    setSuggestionStrip([]);
    stopListening();
  }, [setSuggestionStrip, stopListening]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Live Aid</Text>
        <TranscriptView transcript={transcript} />
        <SuggestionStrip
          suggestions={suggestionStrip}
          onSelect={handleSelectSuggestion}
          onExpand={() => setExpanded(true)}
        />
        <LargeTextCard text={selectedText} />
        <TouchableOpacity
          style={styles.speakButton}
          onPress={handleSpeak}
          accessibilityRole="button"
          accessibilityLabel="Speak selected phrase"
        >
          <Text style={styles.speakButtonText}>Speak</Text>
        </TouchableOpacity>
        <TopicSelector topics={topics} current={topic} onSelect={setTopic} />
        <MicControl listening={listening} onToggle={toggleListening} onQuickHide={handleQuickHide} />
      </ScrollView>
      <Modal visible={expanded} transparent animationType="fade" onRequestClose={() => setExpanded(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>More suggestions</Text>
            {suggestionStrip.map(suggestion => (
              <TouchableOpacity
                key={suggestion.id}
                style={styles.modalItem}
                onPress={() => {
                  handleSelectSuggestion(suggestion);
                  setExpanded(false);
                }}
              >
                <Text style={styles.modalItemText}>{suggestion.text}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setExpanded(false)}
              accessibilityRole="button"
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f121a'
  },
  container: {
    padding: 24,
    gap: 16
  },
  title: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '700'
  },
  speakButton: {
    backgroundColor: '#4f7cff',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center'
  },
  speakButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  modalContent: {
    backgroundColor: '#1d2333',
    borderRadius: 20,
    padding: 24,
    width: '100%'
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12
  },
  modalItem: {
    paddingVertical: 12
  },
  modalItemText: {
    color: '#ffffff',
    fontSize: 18
  },
  modalClose: {
    marginTop: 16,
    backgroundColor: '#3478f6',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center'
  },
  modalCloseText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default AidScreen;
