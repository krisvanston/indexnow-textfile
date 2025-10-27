import '@testing-library/jest-native/extend-expect';
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock';

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

const executeSqlMock = jest.fn(async () => [
  {
    rows: {
      length: 0,
      item: () => null
    }
  }
]);

jest.mock('react-native-sqlite-storage', () => ({
  enablePromise: () => {},
  openDatabase: () => Promise.resolve({executeSql: executeSqlMock})
}));

jest.mock('react-native-tts', () => ({
  speak: jest.fn(),
  setDefaultVoice: jest.fn(),
  stop: jest.fn()
}));

export {executeSqlMock};
