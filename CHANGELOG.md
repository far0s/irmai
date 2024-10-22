# irmai Changelog

## Todo's in order of importance (move these to releases when in progress or done)

- [ ] FEATURE/UI: outro screen (including a shareable image recapping the reading)
- [ ] CHORE: update metatags and SEO
- [ ] BUGFIX/SAFARI: logo filter blur not working

## Releases

### 0.8.1 - released 23/10/2024

- [ ] BUGFIX: cardStack does not scale properly on mobile and desktop
- [ ] BUGFIX: going to OutroScreen crashes the app on mobile
- [ ] UI: autoscroll transcript on new transcript messages
- [x] FEATURE/UI: add hide app button in the header (needs to be persistent) (to see the aura in full)\
- [x] UI: hide scrollbars in Transcript and ChatScreen

### 0.8.0 - released 22/10/2024

- [x] FEATURE/UI: improve/pimp card view
- [x] FEATURE/UI: live transcript as the AI speaks
- [x] FEATURE/UI: revamp most of the main flow screens
- [x] FEATURE: about page with a short description of the project, the team, etc.


### 0.7.0 - released 25/07/2024

- [x] FEATURE/UI: card stack animation
- [x] FEATURE/UI: aura becomes more complex the longer the conversation goes

### 0.6.1 - released 20/06/2024

- [x] BUGFIX/DEBUG: better debug management

### 0.6.0 - released 10/06/2024

- [X] BUGFIX/CARDS: fix cards crashing the app (we now limit to 50 cards loaded at a time)
- [x] FEATURE/AI: "Chaos Mode" – based on trigger X in the conversation, the AI will become more chaotic, sarcastic, humourous, unhinged, etc.

### 0.5.3 - released 27/05/2024

- [x] BUGFIX: solve minified React errors in production (418, 423, 425)

### 0.5.2 - released 24/05/2024

- [x] BUGFIX: debounce causing reload issue on safari at cardsShaker

### 0.5.1 - released 22/05/2024

- [x] CHORE: clean up reset/restart functionality

### 0.5.0 - released 22/05/2024

- [x] FEATURE/UI: add 'The Orb', animated centerpiece reacting to app's state and AI's outputs
- [x] FEATURE/ART: add tarot cards
- [x] FEATURE/UI: update splash screen to properly ask for mic permissions

### 0.4.0 - released 16/05/2024

- [x] CHORE/AI: move API key to project API key in OpenAI. Same for Project and Assistant
- [x] FEATURE/AI: replace useChat for useAssistant
  - [x] create assistant in OpenAI (figure out system prompts etc.)
  - [x] update UI to use the new helpers

### 0.3.0 - released 13/05/2024

- [x] FEATURE: refactor screens to simplify UX flow

### 0.2.5 - released 05/05/2024

- [x] BUGFIX: QuestionScreen - tentative fix for potential issue with state getting stuck on thinking
- [x] CHORE: refactore /api/tarot to allow to pull a select number of cards, or all

### 0.2.4 - released 05/05/2024

- [x] CHORE/UI: continue refactoring and cleaning up the screens for better transitions and flow
- [x] CHORE: refactor transcript components to be reusable in screens too
- [x] BUGFIX: prevent messages to be read out loud if the page loads at the question screen

### 0.2.3 - released 05/05/2024

- [x] BUGFIX/UI: re-do Header styles and transitions from Splash Screen
- [x] FEATURE/Safari: wait for mic permissions to be granted before showing the header
- [x] FEATURE/UI: clean up animations and interactions across all screens

### 0.2.2 - released 04/05/2024

- [x] CHORE: added a changelog and todo

### 0.2.1 - released 04/05/2024

- [x] FEATURE: huge refactors and cleanups
- [x] BUGFIX: font bugs in production

### 0.2.0 - released 03/05/2024

- [x] new UX, new UI
- [x] OpenAI: figure out a way to record and play audio
- [x] placed POC code in archive folders

### 0.1.0 - released 26/11/2023

- [x] initial POC release
- [ ] CHORE/AI: move API key to project API key in OpenAI. Same for Project and Assistant
