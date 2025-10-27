import React, {useEffect} from 'react';
import {render} from '@testing-library/react-native';
import AidScreen from '../../src/screens/AidScreen';
import {AppStateProvider, useAppState} from '../../src/state/AppStateContext';
import {Suggestion} from '../../src/services/suggestions/types';

const suggestions: Suggestion[] = [
  {id: '1', text: 'Can you repeat that?', score: 1, source: 'personal'},
  {id: '2', text: 'I need a pause', score: 0.8, source: 'personal'},
  {id: '3', text: 'Give me a moment', score: 0.7, source: 'personal'}
];

const Harness: React.FC = () => {
  const {setSuggestionStrip} = useAppState();
  useEffect(() => {
    setSuggestionStrip(suggestions);
  }, [setSuggestionStrip]);
  return <AidScreen />;
};

describe('AidScreen accessibility', () => {
  it('renders transcript and suggestion strip with accessibility labels', () => {
    const {getByLabelText, getAllByRole} = render(
      <AppStateProvider>
        <Harness />
      </AppStateProvider>
    );

    expect(getByLabelText('Live transcript')).toBeTruthy();
    expect(getByLabelText('Suggestion strip')).toBeTruthy();
    const buttons = getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
