# The Rigged Polygraph

A cyberpunk-themed polygraph simulator web application built with React, TypeScript, and Vite. This interactive web app simulates a biometric polygraph scanner with a futuristic HUD interface, complete with sound effects, animations, and device tilt detection for a playful "rigged" experience.

## Features

- **Cyberpunk HUD Interface**: Immersive high-tech UI with neon accents, scanlines, and glitch effects
- **Interactive Biometric Scanner**: Press-and-hold fingerprint scanner with visual and audio feedback
- **Device Tilt Detection**: Uses device orientation to secretly control the outcome (tilt left for TRUTH, right for LIE)
- **Dynamic Sound Effects**: Scanning, truth, and lie sound effects for enhanced immersion
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Real-time Waveform Display**: Animated ECG-style waveform that responds to scanning state

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI Framework**: TailwindCSS, shadcn/ui, Radix UI components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: Wouter
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with ESBuild
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RajanthaR/web-manus-rigged-polygraph.git
cd web-manus-rigged-polygraph
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
pnpm build
```

### Running Production Build

```bash
pnpm start
```

## Project Structure

```
web-manus-rigged-polygraph/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   └── src/               # Source code
│       ├── components/    # React components
│       ├── hooks/         # Custom React hooks
│       ├── pages/         # Page components
│       └── contexts/      # React contexts
├── server/                # Express server (if needed)
├── shared/                # Shared types/utilities
└── patches/              # Package patches
```

## Key Components

- **PolygraphScanner**: Main interactive scanner component with press-and-hold functionality
- **WaveformDisplay**: Real-time animated ECG-style waveform visualization
- **useTiltDetection**: Custom hook for device orientation detection
- **useSoundEffects**: Custom hook for managing sound effects

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

## How It Works

The polygraph simulator uses device orientation API to detect the tilt of the device:

- **Tilt Left**: Results in "TRUTH"
- **Tilt Right**: Results in "LIE"  
- **No Tilt**: Random outcome

This creates a fun party trick where the operator can secretly control the results by tilting the device.

## Contributing

This project is fully owned and maintained by Rajantha R Ambegala. All rights reserved.

## License

Copyright © 2024 Rajantha R Ambegala. All rights reserved.

## Author

**Rajantha R Ambegala**
- GitHub: [@RajanthaR](https://github.com/RajanthaR/)
- Email: rajantha.rc@gmail.com

## Acknowledgments

Built with modern web technologies and inspired by cyberpunk aesthetics and biometric security interfaces.
