import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface TopicSelectorProps {
  topics: string[];
  current: string;
  onSelect: (topic: string) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({topics, current, onSelect}) => {
  return (
    <View style={styles.container} accessibilityLabel="Topic selector">
      {topics.map(topic => {
        const selected = topic === current;
        return (
          <TouchableOpacity
            key={topic}
            style={[styles.topicButton, selected && styles.topicSelected]}
            onPress={() => onSelect(topic)}
            accessibilityRole="button"
            accessibilityState={{selected}}
          >
            <Text style={styles.topicText}>{topic}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 16
  },
  topicButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#2c364c'
  },
  topicSelected: {
    backgroundColor: '#4f7cff'
  },
  topicText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600'
  }
});

export default TopicSelector;
