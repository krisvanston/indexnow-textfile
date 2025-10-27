# EchoFriend

EchoFriend is a React Native (TypeScript) scaffold for a smart conversation companion designed for people with aphasia. The project emphasises on-device processing, privacy, and accessible UI patterns.

## Features

- **Onboarding** that explains privacy, captures consent, and seeds the user profile.
- **Aid screen** with mocked ASR, live transcript, suggestion strip, large text card, and quick TTS.
- **Practice mode** for scenario-based rehearsal with topic prompts.
- **Library** view for personal phrases and quick search.
- **Settings** to manage permissions, thresholds, cloud toggle, and data controls.
- **Storage layer** backed by SQLite (with mocks in tests) for user profile, phrases, sessions, and samples.
- **Suggestion engine** blending personal phrases, cache, and global fallbacks with trigger detection.
- **Testing suite** covering suggestion ranking, triggers, storage, ASR integration, and Aid screen accessibility.
- **Seed and demo scripts** for generating sample data and replaying a scripted session.

## Getting started

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Run the Metro bundler:

   ```bash
   yarn start
   ```

3. Launch the iOS simulator:

   ```bash
   yarn ios
   ```

4. Run the automated tests:

   ```bash
   yarn test
   ```

### Type checking and linting

```bash
yarn typecheck
yarn lint
```

## Project structure

- `src/` – application source (screens, components, services, state, models, utils).
- `tests/` – unit, integration, and accessibility-focused UI tests.
- `scripts/` – utilities for seeding data and running demo flows.

## Privacy & safety

- Personal data stored locally in encrypted SQLite (encryption layer to be implemented in native module).
- Opt-in cloud toggle that can reroute ASR/suggestion requests to a remote API in the future.
- Quick-hide button mutes mic and blanks the active card.
- Export and delete controls available under settings.

## Accessibility commitments

- High contrast dark theme, large tap targets, and adjustable text (via system settings).
- VoiceOver labels provided for interactive elements.
- Haptic feedback hooks ready for integration with native modules.

## Scripts

- `yarn seed` – imports sample text and generates personal phrase bank entries.
- `yarn demo` – replays a scripted example session using the mocked ASR pipeline.

## Next steps

- Replace the mock ASR with the Apple Speech framework bridge.
- Integrate a lightweight on-device language model for personalised predictions.
- Expand practice analytics and add bilingual support.
