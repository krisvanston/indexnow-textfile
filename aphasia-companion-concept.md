# Aphasia Companion App Concept

## Vision
Create a conversational companion that helps people with aphasia express themselves confidently during daily interactions. The app listens, adapts to the user, and offers multimodal prompts—text, images, and speech—to keep conversations flowing naturally.

## Core Principles
1. **User-first communication** – Reduce frustration by prioritizing simplicity and speed over feature count.
2. **Adaptive assistance** – Personalize vocabulary, prompts, and interface layouts based on each person’s speech patterns and goals.
3. **Inclusive design** – Provide a calm visual style, large tap targets, optional contrast modes, and cross-device sync.
4. **Privacy-by-default** – Keep user utterances encrypted, with clear consent before any cloud processing.

## Key User Scenarios
- **Spontaneous chat**: The user taps a phrase starter, speaks, or types, and the app suggests likely follow-up words or sentences.
- **Errand support**: Before a store visit, the companion builds a quick “script” with key vocabulary, reference images, and barcodes.
- **Care partner collaboration**: Caregivers contribute custom phrases or review progress through shared notes.
- **Therapy bridge**: Speech-language pathologists assign tailored practice sets and review analytics between sessions.

## Feature Outline
### 1. Conversational Canvas
- Live speech capture with on-device recognition tuned for aphasic speech patterns.
- Word and phrase recommendations ranked by context, frequency, and user feedback.
- Quick visual cards (emoji, photos, icons) to complement verbal output.

### 2. Smart Vocabulary Coach
- Progressive word banks grouped by theme and difficulty.
- Spaced-repetition prompts blending speaking, reading, and choosing tasks.
- Feedback loop that celebrates attempts rather than only correct answers.

### 3. Care Circle Portal
- Shared accounts with adjustable permissions for family, friends, and clinicians.
- Messaging layer for gentle reminders or encouragement.
- Secure export of progress summaries for therapy documentation.

### 4. Integrations
- **AI assistance**: Fine-tuned language model that understands the user’s unique phrasing, suggesting clarifications or follow-up sentences.
- **Voice recognition**: Hybrid pipeline combining on-device models for privacy and optional cloud enhancement for noisy environments.
- **Wearables**: Quick prompts via smartwatch complications and haptic cues for pacing.

## Data & AI Approach
- Collect opt-in audio samples to adapt pronunciation models while giving users full control to delete data at any time.
- Train a small personalization layer (e.g., LoRA adapters) on-device or in a private workspace to keep the base model respectful and responsive.
- Incorporate explainability—show why the app recommended a phrase and allow one-tap feedback to improve future suggestions.

## Roadmap Sketch
1. **Discovery**: Interviews with people with aphasia, caregivers, and speech-language pathologists; create empathy maps.
2. **Prototype**: Figma flows and a React Native proof-of-concept focusing on the conversational canvas.
3. **Pilot**: Limited release with remote logging and weekly check-ins to observe real-world usage.
4. **Scale**: Harden infrastructure, pursue clinical validations, and add multilingual support.

## Success Metrics
- Reduced average time-to-utterance during conversations.
- Increased self-reported confidence scores post-interaction.
- Daily active usage across key features (canvas, coach, care portal).
- Positive clinician feedback on therapy alignment.

## Ethical & Accessibility Guardrails
- Transparent user agreements with plain-language summaries.
- Compatibility with screen readers and alternative input methods.
- Emergency assist mode that can call preset contacts or display medical info instantly.

## Next Steps
- Draft research recruitment materials with aphasia advocacy groups.
- Assemble advisory board of speech-language pathologists and lived-experience experts.
- Develop non-technical prototypes (card sorting, script rehearsal) to validate core flows before coding.
