import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {useAppState} from '../state/AppStateContext';
import {nowIso} from '../utils/time';
import {database} from '../services/storage/Database';
import {v4 as uuid} from 'uuid';

const CONSENT_COPY = [
  'EchoFriend keeps your voice on your device first.',
  'You control what is stored and can delete it any time.',
  'Learning is optional and clearly labeled.'
];

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC<Props> = ({navigation}) => {
  const {updateProfile} = useAppState();
  const [consent, setConsent] = useState(false);

  const handleContinue = async () => {
    if (!consent) {
      Alert.alert('Consent needed', 'Please approve local learning to continue.');
      return;
    }
    const profile = {
      id: uuid(),
      locale: 'en-US',
      consent: {learning: true, cloudFallback: false},
      pauseThresholdMs: 800,
      repeatThreshold: 2,
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    await database.upsertUserProfile(profile);
    updateProfile(profile);
    navigation.replace('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to EchoFriend</Text>
      <Text style={styles.subtitle}>Your companion for confident conversations.</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Privacy commitments</Text>
        {CONSENT_COPY.map(line => (
          <Text key={line} style={styles.cardText}>
            • {line}
          </Text>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.consentButton, consent && styles.consentButtonActive]}
        onPress={() => setConsent(value => !value)}
        accessibilityRole="switch"
        accessibilityState={{checked: consent}}
      >
        <Text style={styles.consentText}>{consent ? 'Learning enabled' : 'Enable learning'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.primaryButton} onPress={handleContinue} accessibilityRole="button">
        <Text style={styles.primaryText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#0f121a',
    gap: 20
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700'
  },
  subtitle: {
    color: '#9fb3d1',
    fontSize: 18
  },
  card: {
    backgroundColor: '#182033',
    borderRadius: 16,
    padding: 16,
    gap: 8
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600'
  },
  cardText: {
    color: '#c7d2eb',
    fontSize: 16
  },
  consentButton: {
    borderWidth: 1,
    borderColor: '#4f7cff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center'
  },
  consentButtonActive: {
    backgroundColor: '#4f7cff'
  },
  consentText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  primaryButton: {
    backgroundColor: '#3478f6',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center'
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700'
  }
});

export default OnboardingScreen;
