import fs from 'fs';
import path from 'path';
import {database} from '../src/services/storage/Database';
import {Phrase} from '../src/models';
import {v4 as uuid} from 'uuid';

const main = async () => {
  await database.init();
  const samplePath = path.resolve(__dirname, 'samples/personal.txt');
  const text = fs.readFileSync(samplePath, 'utf8');
  const phrases = text.split('\n').filter(Boolean);
  for (const line of phrases) {
    const phrase: Phrase = {
      id: uuid(),
      text: line.trim(),
      topic: 'General',
      usage_count: 0,
      last_used_at: null,
      source: 'user'
    };
    await database.upsertPhrase(phrase);
  }
  console.log(`Seeded ${phrases.length} phrases.`);
};

main().catch(error => {
  console.error('Failed to seed data', error);
  process.exitCode = 1;
});
