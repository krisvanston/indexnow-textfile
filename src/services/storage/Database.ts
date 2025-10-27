import SQLite from 'react-native-sqlite-storage';
import {Phrase, UserProfile, AudioSample, Session} from '../../models';

SQLite.enablePromise(true);

const DB_NAME = 'echofriend.db';

export class Database {
  private dbPromise: Promise<SQLite.SQLiteDatabase>;

  constructor() {
    this.dbPromise = SQLite.openDatabase({name: DB_NAME, location: 'default'});
  }

  async init() {
    const db = await this.dbPromise;
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS user_profile (
        id TEXT PRIMARY KEY,
        locale TEXT,
        consent_learning INTEGER,
        consent_cloud INTEGER,
        consent_exported_at TEXT,
        pause_threshold_ms INTEGER,
        repeat_threshold INTEGER,
        created_at TEXT,
        updated_at TEXT
      );
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS phrase (
        id TEXT PRIMARY KEY,
        text TEXT,
        topic TEXT,
        usage_count INTEGER,
        last_used_at TEXT,
        source TEXT
      );
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS audio_sample (
        id TEXT PRIMARY KEY,
        path TEXT,
        duration REAL,
        transcript TEXT
      );
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS session (
        id TEXT PRIMARY KEY,
        started_at TEXT,
        ended_at TEXT,
        topic TEXT
      );
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS event (
        id TEXT PRIMARY KEY,
        session_id TEXT,
        type TEXT,
        payload TEXT,
        ts TEXT,
        FOREIGN KEY (session_id) REFERENCES session(id)
      );
    `);
  }

  async upsertUserProfile(profile: UserProfile) {
    const db = await this.dbPromise;
    await db.executeSql(
      `REPLACE INTO user_profile (id, locale, consent_learning, consent_cloud, consent_exported_at, pause_threshold_ms, repeat_threshold, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        profile.id,
        profile.locale,
        profile.consent.learning ? 1 : 0,
        profile.consent.cloudFallback ? 1 : 0,
        profile.consent.dataExportedAt ?? null,
        profile.pauseThresholdMs,
        profile.repeatThreshold,
        profile.createdAt,
        profile.updatedAt
      ]
    );
  }

  async getUserProfile(): Promise<UserProfile | null> {
    const db = await this.dbPromise;
    const [results] = await db.executeSql('SELECT * FROM user_profile LIMIT 1');
    if (results.rows.length === 0) {
      return null;
    }
    const row = results.rows.item(0);
    return {
      id: row.id,
      locale: row.locale,
      consent: {
        learning: row.consent_learning === 1,
        cloudFallback: row.consent_cloud === 1,
        dataExportedAt: row.consent_exported_at ?? undefined
      },
      pauseThresholdMs: row.pause_threshold_ms,
      repeatThreshold: row.repeat_threshold,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async getPhrases(): Promise<Phrase[]> {
    const db = await this.dbPromise;
    const [results] = await db.executeSql('SELECT * FROM phrase ORDER BY usage_count DESC LIMIT 200');
    const phrases: Phrase[] = [];
    for (let i = 0; i < results.rows.length; i += 1) {
      phrases.push(results.rows.item(i));
    }
    return phrases;
  }

  async upsertPhrase(phrase: Phrase) {
    const db = await this.dbPromise;
    await db.executeSql(
      `REPLACE INTO phrase (id, text, topic, usage_count, last_used_at, source) VALUES (?, ?, ?, ?, ?, ?)`,
      [phrase.id, phrase.text, phrase.topic, phrase.usage_count, phrase.last_used_at, phrase.source]
    );
  }

  async recordSession(session: Session) {
    const db = await this.dbPromise;
    await db.executeSql(`REPLACE INTO session (id, started_at, ended_at, topic) VALUES (?, ?, ?, ?)`, [
      session.id,
      session.started_at,
      session.ended_at ?? null,
      session.topic
    ]);
    for (const event of session.events) {
      await db.executeSql(
        `REPLACE INTO event (id, session_id, type, payload, ts) VALUES (?, ?, ?, ?, ?)`,
        [event.id, session.id, event.type, event.payload ?? null, event.ts]
      );
    }
  }

  async storeAudioSample(sample: AudioSample) {
    const db = await this.dbPromise;
    await db.executeSql(`REPLACE INTO audio_sample (id, path, duration, transcript) VALUES (?, ?, ?, ?)`, [
      sample.id,
      sample.path,
      sample.duration,
      sample.transcript
    ]);
  }

  async clearAll() {
    const db = await this.dbPromise;
    await db.executeSql('DELETE FROM event');
    await db.executeSql('DELETE FROM session');
    await db.executeSql('DELETE FROM phrase');
    await db.executeSql('DELETE FROM audio_sample');
    await db.executeSql('DELETE FROM user_profile');
  }
}

export const database = new Database();
