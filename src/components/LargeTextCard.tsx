import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type LargeTextCardProps = {
  text: string;
};

const LargeTextCard: React.FC<LargeTextCardProps> = ({text}) => {
  return (
    <View style={styles.container} accessibilityLabel="Selected phrase">
      <Text style={styles.text}>{text || 'Tap a suggestion to prepare your words.'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#1b2740',
    borderRadius: 20,
    minHeight: 120,
    justifyContent: 'center'
  },
  text: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600'
  }
});

export default LargeTextCard;
