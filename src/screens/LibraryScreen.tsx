import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TextInput, View} from 'react-native';
import {database} from '../services/storage/Database';
import {Phrase} from '../models';

const LibraryScreen: React.FC = () => {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    database.getPhrases().then(setPhrases);
  }, []);

  const filtered = phrases.filter(phrase =>
    phrase.text.toLowerCase().includes(query.toLowerCase()) || phrase.topic.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Library</Text>
      <TextInput
        style={styles.search}
        placeholder="Search phrases"
        placeholderTextColor="#6b7280"
        onChangeText={setQuery}
        accessibilityLabel="Search phrases"
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.text}</Text>
            <Text style={styles.itemMeta}>{item.topic}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f121a',
    padding: 24
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16
  },
  search: {
    backgroundColor: '#1d2333',
    color: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },
  list: {
    gap: 12
  },
  item: {
    backgroundColor: '#182033',
    borderRadius: 16,
    padding: 16
  },
  itemText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600'
  },
  itemMeta: {
    color: '#9fb3d1',
    marginTop: 8
  }
});

export default LibraryScreen;
