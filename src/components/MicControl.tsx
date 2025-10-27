import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface MicControlProps {
  listening: boolean;
  onToggle: () => void;
  onQuickHide: () => void;
}

const MicControl: React.FC<MicControlProps> = ({listening, onToggle, onQuickHide}) => {
  return (
    <View style={styles.container} accessibilityLabel="Microphone controls">
      <TouchableOpacity
        style={[styles.button, listening ? styles.active : styles.inactive]}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={listening ? 'Pause listening' : 'Start listening'}
      >
        <Text style={styles.buttonText}>{listening ? 'Pause' : 'Listen'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.quickHide]}
        onPress={onQuickHide}
        accessibilityRole="button"
        accessibilityLabel="Quick hide"
        accessibilityHint="Blanks the screen and mutes the microphone"
      >
        <Text style={styles.buttonText}>Hide</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12
  },
  button: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center'
  },
  active: {
    backgroundColor: '#50c878'
  },
  inactive: {
    backgroundColor: '#3478f6'
  },
  quickHide: {
    backgroundColor: '#ef476f'
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700'
  }
});

export default MicControl;
