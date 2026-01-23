# Remotion Video Showcase Plan for irmai

> **Purpose**: Create short, visually stunning videos to showcase irmai on portfolio and social media.  
> **Format**: Mobile-first (1080×1920, 9:16 ratio), no audio needed.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [Video Compositions](#video-compositions)
3. [Technical Approach](#technical-approach)
4. [Component Adaptations](#component-adaptations)
5. [Design System](#design-system)
6. [Remotion Best Practices](#remotion-best-practices)
7. [Implementation Checklist](#implementation-checklist)

---

## Project Setup

### Folder Structure

```
irmai/
├── remotion/
│   ├── src/
│   │   ├── Root.tsx                 # Composition registry
│   │   ├── index.ts                 # Entry point
│   │   ├── compositions/
│   │   │   ├── AuraPulse.tsx        # 5s shader showcase
│   │   │   ├── CardReveal.tsx       # 8s card selection
│   │   │   ├── TheReading.tsx       # 12s conversation flow
│   │   │   └── FullJourney.tsx      # 20s complete demo
│   │   ├── components/
│   │   │   ├── AuraBackground.tsx   # Adapted GLSL shader
│   │   │   ├── Logo.tsx             # irmai logo
│   │   │   ├── Card.tsx             # Tarot card component
│   │   │   ├── CardStack.tsx        # Fan/stack of cards
│   │   │   ├── GlassyButton.tsx     # Glass morphism button
│   │   │   ├── TypewriterText.tsx   # Animated text reveal
│   │   │   └── PulseIndicator.tsx   # Speaking/listening state
│   │   ├── shaders/
│   │   │   ├── aura.frag            # Fragment shader (copied from public/)
│   │   │   └── aura.vert            # Vertex shader
│   │   ├── styles/
│   │   │   └── global.css           # Design tokens
│   │   └── utils/
│   │       ├── constants.ts         # Colors, timing, card data
│   │       ├── animations.ts        # Reusable animation helpers
│   │       └── cards.ts             # Tarot card data subset
│   ├── public/
│   │   └── cards/                   # Local card images (downloaded)
│   ├── package.json
│   ├── tsconfig.json
│   └── remotion.config.ts
├── app/                             # Existing Next.js app
└── components/                      # Existing components
```

### Dependencies

```json
{
  "name": "irmai-remotion",
  "version": "1.0.0",
  "scripts": {
    "dev": "remotion studio",
    "build": "remotion render",
    "render:aura": "remotion render AuraPulse out/aura-pulse.mp4",
    "render:cards": "remotion render CardReveal out/card-reveal.mp4",
    "render:reading": "remotion render TheReading out/the-reading.mp4",
    "render:full": "remotion render FullJourney out/full-journey.mp4",
    "render:all": "npm run render:aura && npm run render:cards && npm run render:reading && npm run render:full"
  },
  "dependencies": {
    "@remotion/cli": "^4.0.0",
    "@remotion/three": "^4.0.0",
    "@remotion/transitions": "^4.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "remotion": "^4.0.0",
    "three": "^0.170.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/three": "^0.170.0",
    "typescript": "^5.0.0"
  }
}
```

### Installation Commands

```bash
cd irmai/remotion
npm init -y
npx remotion add @remotion/three
npx remotion add @remotion/transitions
```

---

## Video Compositions

### 1. Aura Pulse (5 seconds, 150 frames @ 30fps)

**Purpose**: Pure visual showcase of the signature Aura shader.

**Storyboard**:
| Time | Frame | Description |
|------|-------|-------------|
| 0.0s | 0 | Black screen, shader beginning to bloom |
| 0.5s | 15 | Aura colors emerge (purple → blue gradient) |
| 1.5s | 45 | Logo fades in (spring animation) |
| 3.0s | 90 | Hold on logo, colors morphing |
| 4.0s | 120 | Logo fades out |
| 5.0s | 150 | Aura continues, subtle fade to black |

**Key Elements**:
- Aura shader with animated `u_time`
- Logo SVG with opacity animation
- Color interpolation between card colors

**Use Cases**: Social media header, portfolio thumbnail, loading animation.

---

### 2. Card Reveal (8 seconds, 240 frames @ 30fps)

**Purpose**: Showcase the card selection ceremony.

**Storyboard**:
| Time | Frame | Description |
|------|-------|-------------|
| 0.0s | 0 | Stack of cards (backs visible), Aura background |
| 1.0s | 30 | First card lifts and flips (The Magician) |
| 2.0s | 60 | Card settles, Aura pulses gold |
| 3.0s | 90 | Second card flips (The High Priestess) |
| 4.0s | 120 | Card settles, Aura adds purple |
| 5.0s | 150 | Third card flips (The Empress) |
| 6.0s | 180 | All three cards visible, names appear |
| 7.0s | 210 | Hold on final composition |
| 8.0s | 240 | Gentle fade |

**Key Elements**:
- Card flip animation (3D transform)
- Card glow matching card color
- Aura `u_startColor`, `u_midColor`, `u_endColor` changing
- Typography reveal for card names

---

### 3. The Reading (12 seconds, 360 frames @ 30fps)

**Purpose**: Simulated conversation flow showing the core UX.

**Storyboard**:
| Time | Frame | Description |
|------|-------|-------------|
| 0.0s | 0 | "Your Question" header appears |
| 1.0s | 30 | Question text types on: "What should I focus on?" |
| 3.0s | 90 | Pulse indicator (listening state) |
| 4.0s | 120 | Cards fan out from bottom |
| 5.5s | 165 | Three cards selected (quick succession) |
| 7.0s | 210 | "Your Reading" header appears |
| 8.0s | 240 | AI response types on (2-3 sentences) |
| 11.0s | 330 | Aura pulses with "speaking" rhythm |
| 12.0s | 360 | Fade out |

**Key Elements**:
- Typewriter text animation
- Pulse/breathing indicator
- Card selection cascade
- Simulated audio visualization (Aura `u_center_size`)

---

### 4. Full Journey (20 seconds, 600 frames @ 30fps)

**Purpose**: Complete flow demo with scene transitions.

**Storyboard**:
| Time | Frame | Scene | Description |
|------|-------|-------|-------------|
| 0-3s | 0-90 | Splash | Logo animation, tagline |
| 3-6s | 90-180 | Intro | "irmai is your spiritual guide..." text |
| 6-8s | 180-240 | Transition | Fade to Chat |
| 8-12s | 240-360 | Chat | Question + recording state |
| 12-16s | 360-480 | Cards | Card selection sequence |
| 16-19s | 480-570 | Reading | AI response appearing |
| 19-20s | 570-600 | Outro | "Thank you" + fade |

**Key Elements**:
- `<TransitionSeries>` with fade transitions
- All previous components combined
- Cohesive narrative arc

---

## Technical Approach

### Adapting the Aura Shader for Remotion

The main challenge: irmai uses `useFrame()` from React Three Fiber, which is **forbidden** in Remotion (causes flickering during render). We must drive everything from `useCurrentFrame()`.

#### Original (irmai/components/Background/Aura.tsx):
```tsx
// ❌ FORBIDDEN in Remotion
useFrame((state) => {
  const time = state.clock.getElapsedTime();
  uniforms.u_time.value = time;
  uniforms.u_scale.value = lerp(uniforms.u_scale.value, targetScale, 0.01);
});
```

#### Adapted for Remotion:
```tsx
// ✅ Remotion-compatible
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { ThreeCanvas } from "@remotion/three";

const AuraBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Convert frame to time (seconds)
  const time = frame / fps;
  
  // Spring animation for scale (entrance)
  const scale = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 60,
  });
  
  // Interpolate colors based on frame ranges
  const startColorProgress = interpolate(frame, [0, 90], [0, 1], {
    extrapolateRight: "clamp",
  });
  
  const uniforms = useMemo(() => ({
    u_time: { value: time },
    u_resolution: { value: new THREE.Vector2(width, height) },
    u_scale: { value: scale },
    u_startColor: { value: lerpColor("#194c66", "#CCA300", startColorProgress) },
    // ... other uniforms
  }), [time, scale, startColorProgress, width, height]);
  
  return (
    <ThreeCanvas width={width} height={height}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </ThreeCanvas>
  );
};
```

### Key Shader Uniforms to Animate

| Uniform | Type | Animation Strategy |
|---------|------|-------------------|
| `u_time` | float | `frame / fps` (continuous) |
| `u_scale` | float | `spring()` for entrance, `interpolate()` for zoom |
| `u_bloom` | float | `interpolate()` to increase when cards visible |
| `u_startColor` | vec3 | Lerp to card 1 color on selection |
| `u_midColor` | vec3 | Lerp to card 2 color on selection |
| `u_endColor` | vec3 | Lerp to card 3 color on selection |
| `u_center_size` | float | Pulse with sine wave during "speaking" |
| `u_complexity` | float | `interpolate()` to increase over conversation |
| `u_audioLevels` | float[20] | Simulated with sine waves for visual effect |

### Simulating Audio Visualization

Without real audio, we simulate the `u_audioLevels` for visual effect:

```tsx
const simulatedAudioLevels = useMemo(() => {
  return Array.from({ length: 20 }, (_, i) => {
    // Create wave pattern based on frame
    const wave = Math.sin((frame / fps) * 4 + i * 0.5) * 0.5 + 0.5;
    const noise = Math.sin((frame / fps) * 7 + i * 1.3) * 0.3;
    return (wave + noise) * 50; // Scale to 0-100 range
  });
}, [frame, fps]);
```

---

## Component Adaptations

### Logo Component

Port from `irmai/components/Logo/Logo.tsx`:

```tsx
import { useCurrentFrame, interpolate, spring } from "remotion";

const Logo: React.FC<{ enterFrame?: number; exitFrame?: number }> = ({
  enterFrame = 0,
  exitFrame = Infinity,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Entrance animation
  const enterProgress = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 200 },
  });
  
  // Exit animation
  const exitProgress = exitFrame < Infinity
    ? interpolate(frame, [exitFrame, exitFrame + 15], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  
  const opacity = enterProgress * exitProgress;
  const translateY = interpolate(enterProgress, [0, 1], [20, 0]);
  
  return (
    <svg
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
      // ... SVG paths from original
    />
  );
};
```

### Card Component

Adapt from `irmai/components/Card/Card.tsx`:

```tsx
const Card: React.FC<{
  card: TarotCard;
  flipFrame: number;
  isRevealed: boolean;
}> = ({ card, flipFrame, isRevealed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Flip animation (0 = back, 1 = front)
  const flipProgress = spring({
    frame: frame - flipFrame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  
  // 3D rotation (180deg flip)
  const rotateY = interpolate(flipProgress, [0, 1], [0, 180]);
  
  // Show back when < 90deg, front when >= 90deg
  const showFront = rotateY >= 90;
  
  return (
    <div
      style={{
        transform: `perspective(1000px) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {showFront ? (
        <CardFront card={card} />
      ) : (
        <CardBack style={{ transform: "rotateY(180deg)" }} />
      )}
    </div>
  );
};
```

### TypewriterText Component

For typing effect on questions/responses:

```tsx
const TypewriterText: React.FC<{
  text: string;
  startFrame: number;
  charsPerSecond?: number;
}> = ({ text, startFrame, charsPerSecond = 30 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const framesPerChar = fps / charsPerSecond;
  const elapsedFrames = Math.max(0, frame - startFrame);
  const visibleChars = Math.floor(elapsedFrames / framesPerChar);
  
  const displayText = text.slice(0, visibleChars);
  const showCursor = frame % 30 < 15; // Blinking cursor
  
  return (
    <span>
      {displayText}
      {visibleChars < text.length && showCursor && <span>|</span>}
    </span>
  );
};
```

---

## Design System

### Colors (from irmai/styles/globals.css)

```ts
// utils/constants.ts
export const colors = {
  black: "#0b0216",      // rgb(11, 2, 22)
  cream: "#fffbf2",      // rgb(255, 251, 242)
  purple: "#281595",     // rgb(40, 21, 149)
  purpleLight: "#4124e6", // rgb(65, 36, 230)
} as const;

// Card colors (for Aura shader)
export const cardColors = {
  theMagician: "#CCA300",
  theHighPriestess: "#590059",
  theEmpress: "#1E661E",
  // ... more as needed
} as const;
```

### Typography

```ts
export const typography = {
  fontFamily: {
    body: "Poppins, sans-serif",
    display: "Cirka, serif",
  },
  fontSize: {
    s: 24,   // Scaled up for video
    m: 32,
    l: 48,
    xl: 64,
  },
} as const;
```

### Timing Constants

```ts
export const timing = {
  fps: 30,
  
  // Duration presets (in frames)
  quick: 15,      // 0.5s
  normal: 30,     // 1s
  slow: 60,       // 2s
  verySlow: 90,   // 3s
  
  // Spring configs
  spring: {
    smooth: { damping: 200 },
    snappy: { damping: 20, stiffness: 200 },
    bouncy: { damping: 8 },
  },
} as const;
```

---

## Remotion Best Practices

### From remotion-dev/skills Repository

#### 1. Compositions (compositions.md)

```tsx
// src/Root.tsx
import { Composition, Folder } from "remotion";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="irmai-showcase">
      <Composition
        id="AuraPulse"
        component={AuraPulse}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CardReveal"
        component={CardReveal}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* ... more compositions */}
    </Folder>
  );
};
```

#### 2. Three.js / Shaders (3d.md)

- ✅ Use `<ThreeCanvas>` from `@remotion/three`
- ✅ Always pass `width` and `height` props
- ❌ Never use `useFrame()` from `@react-three/fiber`
- ✅ Drive all animation from `useCurrentFrame()`
- ✅ Set `layout="none"` on `<Sequence>` inside `<ThreeCanvas>`

#### 3. Animations (timing.md)

```tsx
// Spring for natural motion
const entrance = spring({
  frame,
  fps,
  config: { damping: 200 }, // Smooth, no bounce
});

// Interpolate for precise control
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});

// Combining springs
const inAnimation = spring({ frame, fps });
const outAnimation = spring({
  frame,
  fps,
  delay: durationInFrames - fps,
});
const scale = inAnimation - outAnimation;
```

#### 4. Sequencing (sequencing.md)

```tsx
import { Sequence, Series } from "remotion";

// Delay appearance
<Sequence from={30} durationInFrames={60} premountFor={30}>
  <Title />
</Sequence>

// Sequential elements
<Series>
  <Series.Sequence durationInFrames={90}>
    <Splash />
  </Series.Sequence>
  <Series.Sequence durationInFrames={90}>
    <Intro />
  </Series.Sequence>
</Series>
```

#### 5. Transitions (transitions.md)

```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={90}>
    <Splash />
  </TransitionSeries.Sequence>
  
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 15 })}
  />
  
  <TransitionSeries.Sequence durationInFrames={90}>
    <Intro />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

---

## Implementation Checklist

### Phase 1: Setup
- [ ] Create `remotion/` directory structure
- [ ] Initialize npm package with dependencies
- [ ] Copy GLSL shaders to `src/shaders/`
- [ ] Download subset of card images to `public/cards/`
- [ ] Set up `Root.tsx` with composition stubs
- [ ] Create `global.css` with design tokens
- [ ] Create `constants.ts` with colors, timing, card data

### Phase 2: Core Components
- [ ] Adapt `AuraBackground.tsx` (shader with frame-driven animation)
- [ ] Test shader renders correctly in Remotion Studio
- [ ] Port `Logo.tsx` with entrance/exit animations
- [ ] Create `Card.tsx` with flip animation
- [ ] Create `TypewriterText.tsx`
- [ ] Create `PulseIndicator.tsx`

### Phase 3: Compositions
- [ ] Build `AuraPulse.tsx` (simplest, validates shader works)
- [ ] Build `CardReveal.tsx` (validates card animations)
- [ ] Build `TheReading.tsx` (validates text + interaction simulation)
- [ ] Build `FullJourney.tsx` (validates transitions)

### Phase 4: Polish & Render
- [ ] Fine-tune animation timing
- [ ] Add subtle details (shadows, glows, micro-interactions)
- [ ] Render all compositions to MP4
- [ ] Create GIF versions for web embeds
- [ ] Optimize file sizes for portfolio

---

## Card Data Subset

For the videos, we'll use a curated subset of cards:

```ts
// utils/cards.ts
export const showcaseCards = [
  {
    name: "The Magician",
    name_short: "ar01",
    image: "/cards/ar01.jpg",
    color: "#CCA300",
  },
  {
    name: "The High Priestess",
    name_short: "ar02",
    image: "/cards/ar02.jpg",
    color: "#590059",
  },
  {
    name: "The Empress",
    name_short: "ar03",
    image: "/cards/ar03.jpg",
    color: "#1E661E",
  },
  // Add more as needed for variety
];
```

**Source for card images**: `https://sacred-texts.com/tarot/pkt/img/{name_short}.jpg`

---

## Output Specifications

| Composition | Duration | Dimensions | FPS | Est. File Size |
|-------------|----------|------------|-----|----------------|
| AuraPulse | 5s | 1080×1920 | 30 | ~5-8 MB |
| CardReveal | 8s | 1080×1920 | 30 | ~8-12 MB |
| TheReading | 12s | 1080×1920 | 30 | ~12-18 MB |
| FullJourney | 20s | 1080×1920 | 30 | ~20-30 MB |

**Render command example**:
```bash
npx remotion render AuraPulse out/aura-pulse.mp4 --codec=h264 --crf=18
```

---

## References

- [Remotion Documentation](https://www.remotion.dev/docs/)
- [remotion-dev/skills Repository](https://github.com/remotion-dev/skills)
- [irmai AGENTS.md](../AGENTS.md) - Project conventions
- [Original Aura Shader](../public/shaders/aura-noise-figma/fragment.glsl)
- [Original Components](../components/) - Source components to adapt
