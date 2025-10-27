import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type TranscriptViewProps = {
  transcript: string;
};

const TranscriptView: React.FC<TranscriptViewProps> = ({transcript}) => {
  return (
    <View style={styles.container} accessibilityLabel="Live transcript">
      <Text style={styles.text}>{transcript || 'Listening…'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#1d2333',
    borderRadius: 20,
    minHeight: 160,
    justifyContent: 'center'
  },
  text: {
    color: '#ffffff',
    fontSize: 20,
    lineHeight: 28
  }
});

export default TranscriptView;
