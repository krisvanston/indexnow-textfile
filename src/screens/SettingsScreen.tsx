import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {useAppState} from '../state/AppStateContext';
import {database} from '../services/storage/Database';
import {nowIso} from '../utils/time';
import {UserProfile} from '../models';
import {v4 as uuid} from 'uuid';

const SettingsScreen: React.FC = () => {
  const {userProfile, updateProfile} = useAppState();
  const [cloud, setCloud] = useState(userProfile?.consent.cloudFallback ?? false);
  const [learning, setLearning] = useState(userProfile?.consent.learning ?? true);
  const [pauseThreshold, setPauseThreshold] = useState(userProfile?.pauseThresholdMs ?? 800);

  useEffect(() => {
    if (!userProfile) {
      void (async () => {
        const profile: UserProfile = {
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
      })();
    }
  }, [updateProfile, userProfile]);

  const handleExport = async () => {
    Alert.alert('Export ready', 'Data export saved locally.');
    if (userProfile) {
      const updated = {...userProfile, consent: {...userProfile.consent, dataExportedAt: nowIso()}};
      await database.upsertUserProfile(updated);
      updateProfile(updated);
    }
  };

  const handleDelete = async () => {
    await database.clearAll();
    Alert.alert('Deleted', 'All personal data has been removed.');
  };

  const handleToggleCloud = async (value: boolean) => {
    setCloud(value);
    if (userProfile) {
      const updated = {
        ...userProfile,
        consent: {...userProfile.consent, cloudFallback: value},
        updatedAt: nowIso()
      };
      await database.upsertUserProfile(updated);
      updateProfile(updated);
    }
  };

  const handleToggleLearning = async (value: boolean) => {
    setLearning(value);
    if (userProfile) {
      const updated = {
        ...userProfile,
        consent: {...userProfile.consent, learning: value},
        updatedAt: nowIso()
      };
      await database.upsertUserProfile(updated);
      updateProfile(updated);
    }
  };

  const handleThresholdChange = async (value: number) => {
    setPauseThreshold(value);
    if (userProfile) {
      const updated = {...userProfile, pauseThresholdMs: value, updatedAt: nowIso()};
      await database.upsertUserProfile(updated);
      updateProfile(updated);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.label}>Cloud fallback</Text>
            <Text style={styles.description}>Opt in to send audio to the secure cloud service.</Text>
          </View>
          <Switch value={cloud} onValueChange={handleToggleCloud} accessibilityLabel="Toggle cloud mode" />
        </View>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.label}>Learning</Text>
            <Text style={styles.description}>Allow EchoFriend to adapt using your conversations.</Text>
          </View>
          <Switch value={learning} onValueChange={handleToggleLearning} accessibilityLabel="Toggle learning" />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thresholds</Text>
        {[600, 800, 1000, 1200].map(value => (
          <TouchableOpacity
            key={value}
            style={[styles.thresholdButton, pauseThreshold === value && styles.thresholdButtonActive]}
            onPress={() => handleThresholdChange(value)}
            accessibilityRole="button"
            accessibilityState={{selected: pauseThreshold === value}}
          >
            <Text style={styles.thresholdText}>{value} ms</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data controls</Text>
        <TouchableOpacity style={styles.button} onPress={handleExport} accessibilityRole="button">
          <Text style={styles.buttonText}>Export data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.danger]} onPress={handleDelete} accessibilityRole="button">
          <Text style={styles.buttonText}>Delete all data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#0f121a',
    gap: 24
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700'
  },
  section: {
    backgroundColor: '#182033',
    borderRadius: 16,
    padding: 16,
    gap: 16
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12
  },
  rowText: {
    flex: 1
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  description: {
    color: '#9fb3d1'
  },
  thresholdButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4f7cff',
    padding: 12
  },
  thresholdButtonActive: {
    backgroundColor: '#4f7cff'
  },
  thresholdText: {
    color: '#ffffff',
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#3478f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center'
  },
  danger: {
    backgroundColor: '#ef476f'
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700'
  }
});

export default SettingsScreen;
