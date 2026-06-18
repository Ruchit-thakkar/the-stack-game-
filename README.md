# STACK — 3D Isometric Arcade Game

A browser-based block-stacking arcade game inspired by the classic Stack game. Stack colorful, self-shading blocks as high as you can in a 3D isometric perspective!

![Aesthetic](https://img.shields.io/badge/Aesthetics-Premium-darkgreen)
![Tech Stack](https://img.shields.io/badge/Tech_Stack-Next.js_|_Tailwind_|_HTML5_Canvas-blue)
![FPS](https://img.shields.io/badge/Performance-60_FPS-cyan)

## 🎮 How to Play

- **Objective**: Stack blocks on top of each other. The parts of the block that overhang are sliced off and fall down.
- **Controls**:
  - **Desktop**: Click/tap anywhere or press **SPACEBAR** / **ENTER** to drop the sliding block.
  - **Mobile**: Tap anywhere on the screen.
- **Scoring**:
  - Placing a block successfully: **+1 point**
  - **PERFECT Drop** (landing within 2 pixels of alignment): **+2 points** (does not shrink block width!)

## 🚀 Features

- **3D Isometric Graphics**: Rendered on a single vanilla canvas utilizing direct matrix coordinate translation.
- **Rainbow Hue Transition**: Stacked blocks shift hue continuously as you build higher.
- **Debris Physics**: Overhanging parts are sliced off and fall with realistic gravity and rotation.
- **Autopilot Demonstration**: The start screen features a automated AI game playing in the background behind a blurred overlay.
- **High Score Persistence**: Automatically tracks and saves your high score in `localStorage`.
- **High-DPI Support**: Automatically scales to native screen resolution for crisp pixels.
- **Responsive Viewports**: Formatted with full-viewport scaling on mobile and a centered 480px width envelope on desktop.

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Game Engine**: HTML5 Canvas API (zero-dependency requestAnimationFrame loop)
- **State Management**: React Hooks (`useGameEngine`, `useLocalStorage`)

## 📦 Getting Started

To run the project locally, install dependencies and start the development server:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to play the game!
