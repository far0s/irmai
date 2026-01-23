# AGENTS.md

> **irmai** — AI-powered tarot reading experience · Next.js 14 · React 18 · OpenAI Assistant API · GLSL shaders · Voice interaction

---

## Prime Directives

**You are a steward of this codebase.** Every change either improves it or degrades it. Choose improvement. Leave it better than you found it.

### Quality Signals

- **DRY**: If you write something twice, extract it
- **Single Responsibility**: One function, one job
- **Explicit > Implicit**: Future readers can't read your mind
- **Types as Documentation**: Let TypeScript do the explaining
- **UX First**: This is an immersive experience — don't break the magic

### Think Before You Code

1. **Understand first** — Explore the codebase before changing
2. **Plan concisely** — State what you'll do in 1-3 bullets
3. **Change minimally** — Touch only what's necessary
4. **Verify always** — Run `npm run lint` and `npm run build` before declaring victory

---

## Critical Constraints

| Constraint                       | Reason                                           |
| -------------------------------- | ------------------------------------------------ |
| **Tailwind + CSS Variables**     | Uses Tailwind with custom properties in globals  |
| **OpenAI Assistant API**         | Uses `useAssistant` hook, not `useChat`          |
| **Voice is core**                | STT/TTS via Whisper & gpt-4o-mini-tts            |
| **GLSL shaders (not TSL)**       | Classic fragment/vertex shaders in `/public/`    |
| **Zustand for state**            | All global state via `useIrmaiStore`             |
| **Protect the Aura**             | The background shader is the visual signature    |
| **Don't break the flow**         | splash → intro → chat → outro is sacred          |

---

## Commands

```bash
npm run dev          # Start with Turbopack + HTTPS (required for mic)
npm run build        # Production build
npm run lint         # Check for issues
npm run start        # Run production build
```

**Note**: Local dev requires HTTPS for microphone access. Next.js auto-generates certificates.

---

## Project Structure

```
irmai/
├── app/
│   ├── api/
│   │   ├── assistant/       # OpenAI Assistant thread handling
│   │   ├── speech-to-text/  # Whisper transcription
│   │   ├── text-to-speech/  # TTS with gpt-4o-mini-tts
│   │   ├── tarot/           # Card data API
│   │   └── dynamic-image/   # Share image generation
│   ├── layout.tsx           # Root layout + StoreProvider
│   └── page.tsx             # Main app orchestration
├── components/
│   ├── Background/          # GLSL Aura shader (React Three Fiber)
│   ├── Card/                # Tarot card component
│   ├── CardsShaker/         # Card selection interface
│   ├── Screens/             # Flow screens (Splash, Intro, Chat, Outro)
│   ├── GlassyButton/        # Primary UI buttons
│   └── ZustandStoreProvider/# Global state context
├── hooks/
│   ├── use-recorder.ts      # Audio recording
│   ├── use-audio-levels.ts  # Real-time audio visualization
│   ├── use-transcript.ts    # Message processing
│   └── use-zustand-state.ts # Store definition
├── utils/
│   ├── speech-to-text.ts    # STT client helper
│   ├── text-to-speech.ts    # TTS client helper
│   ├── prompts.ts           # AI prompt templates
│   └── shared-types.ts      # TypeScript types
├── public/
│   └── shaders/             # GLSL shader files
└── styles/
    ├── globals.css          # CSS variables + Tailwind base
    └── reset.css            # CSS reset
```

---

## Key Systems

### Global State (Zustand)

All app state lives in `useIrmaiStore`. Key slices:

```typescript
globalState: "splash" | "intro" | "chat" | "outro"  // Current flow screen
isSpeaking / isListening / isThinking              // Voice states
selectedCards: ITarotCard[]                         // Chosen tarot cards
auraColors: { startColor, midColor, endColor }     // Shader colors
isMuted: boolean                                    // Audio mute state
```

**Usage:**
```typescript
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

const globalState = useIrmaiStore((s) => s.globalState);
const setGlobalState = useIrmaiStore((s) => s.setGlobalState);
```

### OpenAI Integration

- **Assistant API** (`app/api/assistant/`): Thread-based conversations via `useAssistant` hook
- **Speech-to-Text** (`app/api/speech-to-text/`): Whisper transcription (edge runtime)
- **Text-to-Speech** (`app/api/text-to-speech/`): gpt-4o-mini-tts with custom voice instructions

**Voice Instructions** (in `text-to-speech/route.ts`):
```
Voice Affect: Gentle; embody interest and empathy.
Tone: Calm, reassuring, peaceful; convey genuine warmth and serenity.
```

### Aura Shader System

The background shader (`components/Background/`) creates the mystical atmosphere:

1. **GLSL files** live in `public/shaders/aura-noise-figma/`
2. **Aura.tsx** binds uniforms to React state:
   - `u_audioLevels` — reacts to mic/TTS audio
   - `u_scale` / `u_bloom` — adjusts when cards visible
   - `u_startColor/midColor/endColor` — set by selected cards
   - `u_complexity` — increases with conversation length
3. **Leva controls** for debugging in dev mode

### Flow Screens

| Screen   | Purpose                           | Key Actions                    |
| -------- | --------------------------------- | ------------------------------ |
| Splash   | Welcome, mic permissions          | → Intro                        |
| Intro    | Explain tarot question framing    | → Chat                         |
| Chat     | Record question, select cards, converse | Record, Cards, → Outro   |
| Outro    | Conclusion, share image           | Reset → Splash                 |

---

## TypeScript & Styling Conventions

### TypeScript

- Strict mode enabled
- Path alias: `@/` for project root
- Key types in `utils/shared-types.ts`:
  - `TGlobalState` — flow screen names
  - `ITarotCard` — card data structure
  - `TVoice` — OpenAI voice options

### Styling

- **Tailwind** for utility classes
- **CSS Variables** in `styles/globals.css`:
  - Colors: `--black`, `--cream`, `--purple`, `--purple-light`
  - Spacing: `--padding-s`, `--padding-m`
  - Typography: `--text-size-s/m/l`
  - Transitions: `--transition-slow-flow`, `--transition-fast-out`
- **CSS Modules** for component styles (`.module.css`)
- **Fonts**: Poppins (body), Cirka (display)

### Components

- One folder per component: `components/{Name}/Name.tsx`
- Styles: `name.module.css` (lowercase)
- Heavy components dynamically imported:
  ```typescript
  const Background = dynamic(() => import("@/components/Background/Background"), {
    ssr: false,
  });
  ```

---

## Adding Features

### Add a New Screen

1. Create `components/Screens/NewScreen.tsx`
2. Add to `TGlobalState` in `utils/shared-types.ts`
3. Add to `Screens` object in `app/page.tsx`
4. Update flow transitions in adjacent screens

### Add a New Hook

1. Create `hooks/use-{name}.ts`
2. Use consistent naming: `use-kebab-case.ts`
3. Return typed values

### Add an API Route

1. Create `app/api/{name}/route.ts`
2. For edge runtime, add `export const runtime = "edge";`
3. Validate inputs, handle errors gracefully
4. Protect non-local routes if needed:
   ```typescript
   if (req.headers.get("host") !== "localhost:3000") {
     return new Response(null, { status: 404 });
   }
   ```

### Modify the Aura Shader

1. Edit `public/shaders/aura-noise-figma/fragment.glsl`
2. Add new uniforms to `Aura.tsx`:
   - In `uniforms` object (initial values)
   - In `useFrame` callback (animation)
3. Test with Leva controls in dev mode

---

## Environment Variables

Required in `.env`:

```bash
OPENAI_API_KEY=sk-...          # OpenAI API key
OPENAI_ASSISTANT_ID=asst_...   # Pre-configured assistant ID
```

Pull from Vercel (if you have access):
```bash
vercel env pull
```

---

## Performance Notes

### Dynamic Imports

Heavy components are lazy-loaded:
- `Background` (WebGL/Three.js)
- `Debug` (Leva controls)

### Memoization

- Screens are pre-memoized in `page.tsx`
- `CardsShaker` card elements use `useMemo`
- Components wrapped in `memo()` where beneficial

### Audio Handling

- `useRecorder` starts at 1000ms to avoid iOS empty audio bug
- `useAudioLevels` uses `requestAnimationFrame` for real-time visualization
- TTS uses Web Audio API with `GainNode` for mute control

---

## Debugging

### Leva Controls

Dev mode shows Leva panel for shader tweaking:
- Adjust `u_detail`, `u_scale`, `u_bloom`, `u_complexity`
- Switch between shader presets

### Debug Mode

`debug` flag in Zustand store (auto-enabled in dev):
```typescript
const debug = useIrmaiStore((s) => s.debug);
```

### Hide App Toggle

Header toggle to hide UI and see the Aura fullscreen.

---

## Team

- Seb Dancer-Michel
- AJ Marshall  
- Sunniva Ottestad
- Zelda Colombo
