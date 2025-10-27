import {database} from '../../src/services/storage/Database';
import {UserProfile} from '../../src/models';
import {executeSqlMock} from '../setupTests';

jest.mock('uuid', () => ({v4: () => 'uuid'}));

describe('Database', () => {
  beforeEach(() => {
    executeSqlMock.mockClear();
  });

  it('upserts a user profile', async () => {
    const profile: UserProfile = {
      id: 'test',
      locale: 'en-US',
      consent: {learning: true, cloudFallback: false},
      pauseThresholdMs: 800,
      repeatThreshold: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await database.upsertUserProfile(profile);
    expect(executeSqlMock).toHaveBeenCalled();
  });
});
