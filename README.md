# AEROSTRIKE 🚀⚡
> **Futuristic High-Speed Sci-Fi Jetpack Racing & Action Combat Game**

AEROSTRIKE is an indie high-energy 2D sci-fi action racing game built with **Phaser 3**, **TypeScript**, **Vite**, and **Canvas2D/WebGL procedural graphics**. Race at 300–500 KM/H through illuminated megacity skylines, customize pilot loadouts, unleash weapon energy systems, and defeat massive arena boss encounters.

---

## 🌟 Key Features

- **🏎️ High-Speed Racing Mechanics**: Smooth 60 FPS physics handling vertical thrust, dive descents, energy boosts, and track obstacle turbulence.
- **🤖 5 Unique Playable Sci-Fi Pilots**:
  - **VOLT**: Hero athletic pilot with balanced speed and tactical maneuverability.
  - **NOVA**: Crimson speed specialist featuring back-swept aerodynamic winglets.
  - **TITAN**: Broad, heavy juggernaut built with reinforced armor plating.
  - **ECHO**: Agility specialist with mint green energy conduits.
  - **RIFT**: Experimental prototype suit with an asymmetric pauldron and optical visor optics.
- **⚡ Equipment & Garage System**:
  - **Jetpack Equipment**: `VECTOR`, `OVERDRIVE`, `TITAN CORE`, and unlockable `OVERDRIVE MK-II`.
  - **Weapon Systems**: `PULSE BLASTER`, `PLASMA CANNON`, and project-clearing `SHOCKWAVE`.
- **🏙️ World 1 — Neon District**: Multi-layer dark atmospheric megacity parallax background with illuminated glass skyscrapers, sky bridges, and glowing highways designed for optimal gameplay readability.
- **👹 World 1 Boss Arena — Neon Behemoth**:
  - Multi-phase boss fight (Energy Cannons $\rightarrow$ Laser Sweep $\rightarrow$ Exposed Core Overdrive).
  - Weak-point critical multiplier mechanics (`+2.5x` damage).
- **💾 Progression & Save System**: Persistent Points earnings, equipment unlocks, and loadout preferences stored safely in `localStorage`.

---

## 🛠️ Tech Stack & Architecture

- **Engine**: [Phaser 3](https://phaser.io/) (WebGL Rendering & Arcade Physics)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Type Safety)
- **Build Tool**: [Vite](https://vitejs.dev/) (Instant HMR & Bundling)
- **Audio Engine**: [Howler.js](https://howlerjs.com/) (Positional SFX & Dynamic Chimes)
- **Art Direction**: Procedural Canvas2D anti-aliased sci-fi sprites & layered parallax graphics.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16 or higher) installed on your machine.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/aerostrike.git
   cd aerostrike
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🎮 Controls & Pilot Guide

| Input Key | Function |
| :--- | :--- |
| **`W` / `UP` / `SPACE`** | Jetpack Vertical Thrust |
| **`S` / `DOWN`** | Dive Descent |
| **`A` / `D`** | Horizontal Steering & Trim |
| **`SHIFT`** | High-Speed Energy Boost |
| **`J` / `LEFT CLICK`** | Fire Equipped Weapon System |
| **`R`** | Quick Restart |
| **`ESC`** | Pause Game |

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).
