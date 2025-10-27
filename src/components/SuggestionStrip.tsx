import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Suggestion} from '../services/suggestions/types';

type SuggestionStripProps = {
  suggestions: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
  onExpand?: () => void;
};

const SuggestionStrip: React.FC<SuggestionStripProps> = ({suggestions, onSelect, onExpand}) => {
  return (
    <View style={styles.container} accessibilityLabel="Suggestion strip">
      {suggestions.slice(0, 3).map(suggestion => (
        <TouchableOpacity
          key={suggestion.id}
          style={styles.chip}
          onPress={() => onSelect(suggestion)}
          accessibilityRole="button"
          accessibilityHint={`Insert suggestion ${suggestion.text}`}
        >
          <Text style={styles.chipText}>{suggestion.text}</Text>
        </TouchableOpacity>
      ))}
      {suggestions.length > 3 && (
        <TouchableOpacity
          style={[styles.chip, styles.expandChip]}
          onLongPress={onExpand}
          accessibilityRole="button"
          accessibilityHint="Long press to expand suggestions"
        >
          <Text style={styles.chipText}>+{suggestions.length - 3}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16
  },
  chip: {
    backgroundColor: '#2f3b57',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20
  },
  expandChip: {
    backgroundColor: '#4a5d86'
  },
  chipText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default SuggestionStrip;
