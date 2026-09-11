# AEROSTRIKE 🚀⚡

### Futuristic High-Speed Sci-Fi Jetpack Racing & Action Combat

AEROSTRIKE is a high-energy 2D sci-fi racing and action combat game built around one idea:

> **Speed. Combat. Customization. Boss Battles.**

Pilot futuristic jetpack-equipped racers through a neon megacity, navigate obstacles at extreme speeds, manage energy, use powerful weapon systems, unlock equipment, and fight the massive **Neon Behemoth**.

---

## 🎬 Gameplay Demo

> **Gameplay Video:** [Watch AEROSTRIKE Gameplay](https://youtu.be/XucU4tUBR0k?si=pLKsVJzpR2QOkBkU)

---

## 📸 Screenshots

> Screenshots from the playable prototype.

![AEROSTRIKE Gameplay](screenshots/gameplay.png)

![AEROSTRIKE Combat](screenshots/combat.png)

![Neon Behemoth Boss Fight](screenshots/boss.png)

---

# 🎮 Game Overview

AEROSTRIKE combines high-speed jetpack movement with arcade-style racing and combat.

The player controls a futuristic pilot and must navigate the environment while:

- Maintaining high speed
- Avoiding environmental obstacles
- Using jetpack movement and boosts
- Managing energy
- Attacking enemies
- Unlocking equipment
- Improving their loadout
- Surviving increasingly difficult encounters
- Fighting the Neon Behemoth boss

The prototype focuses on delivering the core gameplay loop of:

**Race → Dodge → Boost → Fight → Progress → Boss Battle**

---

# 🌟 Core Gameplay Features

## 🏎️ High-Speed Racing

AEROSTRIKE features fast-paced arcade movement designed around:

- Vertical jetpack thrust
- Dive and descent mechanics
- Horizontal steering
- High-speed energy boosts
- Environmental obstacles
- Turbulence and movement challenges

The movement system is designed to keep the player constantly engaged while maintaining control at high speeds.

---

## 🤖 Playable Pilots

The prototype includes five futuristic pilot characters:

### VOLT
Balanced pilot focused on speed and maneuverability.

### NOVA
Speed-oriented pilot designed for aggressive racing.

### TITAN
Heavy armored pilot focused on power and durability.

### ECHO
Agility-focused pilot designed around maneuverability.

### RIFT
Experimental prototype with a distinctive futuristic design.

---

# ⚡ Garage & Equipment System

Players can customize their gameplay through different equipment and weapons.

### Jetpack Equipment

- `VECTOR`
- `OVERDRIVE`
- `TITAN CORE`
- `OVERDRIVE MK-II`

### Weapon Systems

- `PULSE BLASTER`
- `PLASMA CANNON`
- `SHOCKWAVE`

The garage/progression system provides players with additional loadout options as they progress.

---

# 🏙️ World 1 — Neon District

The first world is a futuristic neon megacity featuring:

- Layered parallax environments
- Illuminated skyscrapers
- Glass structures
- Sky bridges
- Neon highways
- Atmospheric lighting
- High-speed racing corridors

The environment is designed to maintain gameplay readability while creating a futuristic sci-fi atmosphere.

---

# 👹 Boss Battle — Neon Behemoth

The prototype culminates in a multi-phase boss encounter against the **Neon Behemoth**.

### Phase 1 — Energy Cannons

The boss attacks using powerful energy cannons while the player searches for opportunities to strike.

### Phase 2 — Laser Sweep

The boss introduces large sweeping laser attacks that require precise movement and timing.

### Phase 3 — Exposed Core

The boss exposes its core, creating a high-risk opportunity for the player to deal increased damage.

### Weak Point System

Attacking the boss's weak point provides a **2.5× critical damage multiplier**.

---

# 💾 Progression & Save System

Player progression is persisted using browser `localStorage`.

The game stores information such as:

- Points
- Equipment unlocks
- Loadout preferences
- Progression state

This allows progress to persist between sessions.

---

# 🎮 Controls

| Input | Function |
|---|---|
| `W` / `UP` / `SPACE` | Jetpack Vertical Thrust |
| `S` / `DOWN` | Dive Descent |
| `A` / `D` | Horizontal Steering |
| `SHIFT` | High-Speed Energy Boost |
| `J` / `LEFT CLICK` | Fire Equipped Weapon |
| `R` | Quick Restart |
| `ESC` | Pause Game |

---

# 🛠️ Technical Implementation

AEROSTRIKE is built as a browser-based game using a modular architecture.

### Game Engine
**Phaser 3**

Used for:

- Game scenes
- Rendering
- Arcade physics
- Input handling
- Game objects
- Collision systems

### Programming
**TypeScript**

Used to provide structured and type-safe game logic.

### Build System
**Vite**

Used for development, hot reloading, and production builds.

### Audio
**Howler.js**

Used for game sound effects and audio management.

### Rendering

The game uses **Canvas/WebGL rendering** with procedural and layered visual elements.

### Persistence

Browser `localStorage` is used for player progression and loadout persistence.

---

# 🧩 Game Architecture

The project is organized into modular systems for easier development and expansion.

Major areas include:

- Player entities
- Enemy entities
- Boss systems
- Weapon systems
- Game scenes
- UI systems
- Configuration
- Game data
- Player progression
- Input handling
- Audio
- Shared types

This structure allows the game to be expanded with additional:

- Worlds
- Pilots
- Weapons
- Equipment
- Enemies
- Boss encounters
- Gameplay mechanics

---

# 🚀 Getting Started

## Prerequisites

Install **Node.js** on your system.

## Clone the Repository

```bash
git clone https://github.com/Omairkhan66555/aerostrike.git
cd aerostrike
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

## Build for Production

```bash
npm run build
```

---

# 🔮 Future Expansion

Potential future additions include:

- Additional worlds
- More pilots and equipment
- Additional enemy types
- Expanded racing tracks
- More boss encounters
- Multiplayer racing
- Leaderboards
- Additional progression systems
- Expanded weapon customization
