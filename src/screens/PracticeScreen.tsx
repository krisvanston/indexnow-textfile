import React, {useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LargeTextCard from '../components/LargeTextCard';
import {SuggestionEngine} from '../services/suggestions/SuggestionEngine';
import {useAppState} from '../state/AppStateContext';

const PRACTICE_TOPICS = [
  {id: 'coffee', title: 'Coffee order', prompts: ['Order a latte', 'Ask for soy milk']},
  {id: 'gp', title: 'GP visit', prompts: ['Describe your symptoms', 'Ask about medication']},
  {id: 'meeting', title: 'Team meeting', prompts: ['Share project update', 'Ask for clarification']},
  {id: 'family', title: 'Family chat', prompts: ['Talk about weekend', 'Ask about plans']}
];

const PracticeScreen: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState(PRACTICE_TOPICS[0]);
  const [currentPrompt, setCurrentPrompt] = useState(selectedTopic.prompts[0]);
  const {phrases, suggestionStrip, setSuggestionStrip, userProfile} = useAppState();
  const engine = useMemo(() => {
    const e = new SuggestionEngine({});
    e.loadPersonalPhrases(phrases);
    return e;
  }, [phrases]);

  const runSuggestion = () => {
    const suggestions = engine.rankSuggestions(
      {
        transcript: currentPrompt,
        topic: selectedTopic.title,
        recentPhrases: suggestionStrip.map(s => s.text),
        pauseDetected: true
      },
      userProfile
    );
    setSuggestionStrip(suggestions);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice mode</Text>
      <FlatList
        data={PRACTICE_TOPICS}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topicList}
        renderItem={({item}) => {
          const selected = item.id === selectedTopic.id;
          return (
            <TouchableOpacity
              style={[styles.topicCard, selected && styles.topicCardSelected]}
              onPress={() => {
                setSelectedTopic(item);
                setCurrentPrompt(item.prompts[0]);
              }}
              accessibilityRole="button"
              accessibilityState={{selected}}
            >
              <Text style={styles.topicTitle}>{item.title}</Text>
            </TouchableOpacity>
          );
        }}
      />
      <Text style={styles.promptLabel}>Prompt</Text>
      <LargeTextCard text={currentPrompt} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          const index = (selectedTopic.prompts.indexOf(currentPrompt) + 1) % selectedTopic.prompts.length;
          setCurrentPrompt(selectedTopic.prompts[index]);
          runSuggestion();
        }}
      >
        <Text style={styles.buttonText}>Next prompt</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={runSuggestion}>
        <Text style={styles.secondaryButtonText}>Show suggestions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f121a',
    padding: 24,
    gap: 16
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700'
  },
  topicList: {
    gap: 12
  },
  topicCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#1d2333'
  },
  topicCardSelected: {
    backgroundColor: '#4f7cff'
  },
  topicTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  promptLabel: {
    color: '#9fb3d1',
    fontSize: 16
  },
  button: {
    backgroundColor: '#3478f6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center'
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600'
  },
  secondaryButton: {
    borderColor: '#3478f6',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default PracticeScreen;
