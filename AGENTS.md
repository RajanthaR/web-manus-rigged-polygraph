# AGENTS.md — web-manus-rigged-polygraph

## What This App Is

The Rigged Polygraph is a cyberpunk-themed polygraph *simulator* (party toy, not a real detector): press-and-hold a fingerprint scanner, watch an ECG-style waveform, and get a TRUTH/LIE verdict — which is secretly controlled by tilting the device left (truth) or right (lie). Includes sound effects and glitch/scanline HUD aesthetics. Fully client-side.

## Tech Stack

- **Frontend**: React 19 + TypeScript, Vite 7, Tailwind CSS 4, shadcn/ui (Radix primitives), wouter (routing), framer-motion, lucide-react
- **Browser APIs**: DeviceOrientation (tilt detection), Web Audio (sound effects)
- **Backend**: Express (static file serving only — no API layer)
- **Tooling**: pnpm (required — `pnpm-lock.yaml` + patched deps), Prettier, esbuild

## Commands

| Command | Purpose |
|---|---|
| `pnpm install` | Install dependencies (pnpm only) |
| `pnpm dev` | Vite dev server (`vite --host`) at http://localhost:5173 |
| `pnpm build` | `vite build` + esbuild server bundle → `dist/` |
| `pnpm start` | Production server (serves `dist/public`, SPA fallback) on `PORT` (default 3000) |
| `pnpm preview` | Vite preview |
| `pnpm check` | TypeScript type check |
| `pnpm format` | Prettier write |

Prerequisites: Node 18+, pnpm.

**No test script is configured** — vitest is in devDependencies but there is no `test` script and no test files.

## Architecture & Directory Map

```
client/
  index.html
  public/                       Static assets
  src/
    main.tsx / App.tsx          Entry + wouter routes (Home, NotFound)
    pages/Home.tsx              Main scanner screen
    components/PolygraphScanner.tsx  Core scanner interaction (press-and-hold, verdict)
    components/WaveformDisplay.tsx   Animated ECG-style waveform
    components/ui/              shadcn primitives (generated — compose, don't hand-edit)
    hooks/useTiltDetection.ts   DeviceOrientation tilt → verdict control
    hooks/useSoundEffects.ts    Scanning/truth/lie sound effects
    hooks/                      useComposition, useMobile, usePersistFn
    contexts/ThemeContext.tsx
    lib/utils.ts                cn() helper
server/
  index.ts                      Express: static serving + SPA fallback only (no API)
shared/const.ts                 Client+server constants
patches/wouter@3.7.1.patch      Applied via pnpm patchedDependencies — do not delete
ideas.md                        Design brainstorming
.github/                        Issue + PR templates
```

**Data flow**: entirely client-side — no persistence, no backend API, no sensor data leaves the device.

## Where to Make Changes (Conventions)

- **Verdict logic**: `client/src/components/PolygraphScanner.tsx` + `client/src/hooks/useTiltDetection.ts`
- **Sounds**: `client/src/hooks/useSoundEffects.ts`
- **Waveform**: `client/src/components/WaveformDisplay.tsx`
- **New pages**: `client/src/pages/` + wouter route in `client/src/App.tsx`
- **Server changes are rarely needed** — no API layer exists
- **Do NOT delete `patches/wouter@3.7.1.patch`**

## Environment Variables

None beyond `PORT`/`NODE_ENV`. No `.env.example`.

## Ports & URLs

- Dev: http://localhost:5173 (Vite)
- Production: http://localhost:3000 (Express; `PORT` overridable)

## Build & Deploy

`pnpm build` → `dist/public` (client) + `dist/index.js` (server); `pnpm start` serves production.

## Repo-Specific Notes

- Pure entertainment app: no database, no auth, no state beyond the session
- Tilt detection needs a mobile device with orientation sensors; on desktop the verdict flow needs the fallback in `PolygraphScanner.tsx`
- `Map.tsx` / `ManusDialog.tsx` are unused template leftovers
