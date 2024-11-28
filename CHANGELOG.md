# irmai Changelog

## Todo's in order of importance (move these to releases when in progress or done)

- [ ] FEATURE/CARDS: add card minis to represent cards being picked
- [ ] FEATURE/CARDS: range slider synced to card index (maybe)
- [ ] BUGFIX/AI: properly save transcript and display on plage load if already present (to continue the reading)
- [ ] FEATURE/UI: replace cards with custom ones
- [ ] FEATURE/UI: final favicon (bugged on Safari)
- [ ] BUGFIX/SAFARI: logo filter blur not working

## Releases

### 0.10.5 - WIP

- [x] BUGFIX: crashes on mobile, when trying to pull cards (on AJ's phone)
- [x] BUGFIX: performance improvements

### 0.10.4 - released 27/11/2024

- [x] CHORE: new and shiny production URL! [https://irmai.cards](https://irmai.cards)

### 0.10.3 - released 26/11/2024

- [x] FEATURE/UI: update about copy and links
- [x] FEATURE/AI: protect AI API routes from being abused (spam, etc.)
- [x] FEATURE/AURA: when pulling cards, aura should be blurred and scaled up
- [x] FEATURE/UX: move intro text to splashScreen to streamline the experience
- [x] BUGFIX/UI: various style improvements
- [x] BUGFIX/AI: fix the thinking indicator not showing up directly after coming back from cards screen

### 0.10.2 - released 14/11/2024

- [x] BUGFIX/AI: irmai sometimes speaks over itself (double tts)
- [x] BUGFIX/UI: adjust height of footer and splash copy
- [x] BUGFIX/UI: think/speak indicator shows twice after first message
- [x] BUGFIX/TTS: on mobile, the volume doesn't respond to device controls (this is because the browser only has access to the volume if the audio element exists in the DOM)
- [x] BUGFIX/UI/SAFARI: screen scrolls to bottom when it shouldn't
- [x] BUGFIX/UI: fix record CTA "blinking" when thinking

### 0.10.0 - released 06/11/2024

- [x] FEATURE/UI: cleanup outro screen
- [x] FEATURE/UI: create a shareable image from the reading (and share it) on the fly with @vercel/og

### 0.9.0 - released 05/11/2024

- [x] FEATURE/UI: improve card stack animations (esp. intro and outro)
- [x] FEATURE/UI: tie card colours to the aura
- [x] FEATURE/AURA: add random seed for variation

### 0.8.2 - released 23/10/2024

- [x] CHORE: update metatags and SEO

### 0.8.1 - released 23/10/2024

- [x] BUGFIX: cardStack does not scale properly on mobile and desktop
- [x] BUGFIX: going to OutroScreen crashes the app on mobile
- [x] UI: autoscroll transcript on new transcript messages
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

- [x] BUGFIX/CARDS: fix cards crashing the app (we now limit to 50 cards loaded at a time)
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
- [x] CHORE/AI: move API key to project API key in OpenAI. Same for Project and Assistant
