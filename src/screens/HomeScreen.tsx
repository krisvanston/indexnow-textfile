import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {useAppState} from '../state/AppStateContext';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {userProfile} = useAppState();

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Home screen">
      <Text style={styles.title}>EchoFriend</Text>
      <Text style={styles.subtitle} accessibilityRole="text">
        Smart companion for your conversations.
      </Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Aid')}
          accessibilityRole="button"
          accessibilityLabel="Start live conversation aid"
        >
          <Text style={styles.buttonText}>Start Aid</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Practice')}
          accessibilityLabel="Open practice mode"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Practice</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Library')}
          accessibilityRole="button"
          accessibilityLabel="Open personal phrase library"
        >
          <Text style={styles.buttonText}>Library</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Settings')}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
        >
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
      {userProfile ? (
        <View style={styles.profileCard} accessibilityRole="summary">
          <Text style={styles.profileTitle}>Profile</Text>
          <Text style={styles.profileText}>Locale: {userProfile.locale}</Text>
          <Text style={styles.profileText}>Pause threshold: {userProfile.pauseThresholdMs} ms</Text>
          <Text style={styles.profileText}>
            Learning: {userProfile.consent.learning ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
      ) : (
        <Text style={styles.onboardingText}>
          Complete onboarding to personalise your suggestions and privacy controls.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#0f121a'
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 18,
    color: '#9fb3d1',
    marginBottom: 24
  },
  section: {
    marginBottom: 32
  },
  sectionTitle: {
    fontSize: 20,
    color: '#e0e6f8',
    marginBottom: 16
  },
  button: {
    backgroundColor: '#3478f6',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600'
  },
  profileCard: {
    backgroundColor: '#182033',
    borderRadius: 16,
    padding: 20
  },
  profileTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 8
  },
  profileText: {
    color: '#c7d2eb',
    fontSize: 16,
    marginBottom: 4
  },
  onboardingText: {
    color: '#c7d2eb',
    fontSize: 16,
    marginTop: 16
  }
});

export default HomeScreen;
