# irmai Changelog

## Todo's in order of importance (move these to releases when in progress or done)

- [ ] FEATURE/UI: add 'The Orb', animated centerpiece reacting to app's state and AI's outputs
- [ ] FEATURE/ART: add tarot cards
- [ ] FEATURE/UI: style outro screen
- [ ] CHORE: refactor transcript components to be reusable in screens too
- [ ] FEATURE/AI: update TTS API route to use ElevenLabs instead of OpenAI's Whisper
- [ ] CHORE/AI: move API key to project API key in OpenAI. Same for Project and Assistant
- [ ] FEATURE/AI: replace useChat for useAssistant
  - [ ] create assistant in OpenAI (figure out system prompts etc.)
  - [ ] update UI to use the new helpers
- [ ] FEATURE/AI: "Chaos Mode" – based on trigger X in the conversation, the AI will become more chaotic, sarcastic, humourous, unhinged, etc.
- [ ] FEATURE: add an about page with a short description of the project, the team, etc.
- [ ] CHORE: update metatags and SEO
- [ ] BUGFIX/SAFARI: logo filter blur not working
- [ ] BUGFIX: solve minified React errors in production (418, 423, 425)

## Releases

### 0.2.3 - released 05/06/2024

- [x] BUGFIX/UI: re-do Header styles and transitions from Splash Screen
- [x] FEATURE/Safari: wait for mic permissions to be granted before showing the header
- [x] FEATURE/UI: clean up animations and interactions across all screens

### 0.2.2 - released 04/06/2024

- [x] CHORE: added a changelog and todo

### 0.2.1 - released 04/06/2024

- [x] FEATURE: huge refactors and cleanups
- [x] BUGFIX: font bugs in production

### 0.2.0 - released 03/06/2024

- [x] new UX, new UI
- [x] OpenAI: figure out a way to record and play audio
- [x] placed POC code in archive folders

### 0.1.0 - released 26/11/2023

- [x] initial POC release
