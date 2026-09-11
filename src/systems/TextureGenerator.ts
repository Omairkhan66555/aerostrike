import Phaser from 'phaser';
import { CHARACTERS } from '../data/characters';
import { JETPACKS } from '../data/jetpacks';
import { WEAPONS } from '../data/weapons';

export class TextureGenerator {
  /**
   * Generates all cached game textures once during PreloadScene.
   */
  public static generateAll(scene: Phaser.Scene): void {
    this.generateParticles(scene);
    this.generateCharacters(scene);
    this.generateJetpacks(scene);
    this.generateWeapons(scene);
    this.generateProjectiles(scene);
    this.generateTrackElements(scene);
    this.generateCityParallax(scene);
    this.generateBossAssets(scene);
    this.generateUIAssets(scene);
  }

  // --- PARTICLES ---
  private static generateParticles(scene: Phaser.Scene): void {
    if (scene.textures.exists('particle_glow')) return;

    // Glowing dot particle
    const canvas = scene.textures.createCanvas('particle_glow', 16, 16);
    if (canvas) {
      const ctx = canvas.context;
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.4, 'rgba(0, 240, 255, 0.8)');
      grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
      canvas.refresh();
    }

    // Spark particle
    const sparkCanvas = scene.textures.createCanvas('particle_spark', 12, 12);
    if (sparkCanvas) {
      const ctx = sparkCanvas.context;
      const grad = ctx.createRadialGradient(6, 6, 0, 6, 6, 6);
      grad.addColorStop(0, 'rgba(255, 255, 200, 1)');
      grad.addColorStop(0.5, 'rgba(255, 150, 0, 0.8)');
      grad.addColorStop(1, 'rgba(255, 50, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 12, 12);
      sparkCanvas.refresh();
    }

    // Speed streak particle
    const streakCanvas = scene.textures.createCanvas('particle_streak', 32, 4);
    if (streakCanvas) {
      const ctx = streakCanvas.context;
      const grad = ctx.createLinearGradient(0, 2, 32, 2);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
      grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 4);
      streakCanvas.refresh();
    }
  }

  // --- CHARACTERS (FULL HUMANOID SCI-FI RACERS) ---
  private static generateCharacters(scene: Phaser.Scene): void {
    CHARACTERS.forEach((char) => {
      const key = `char_${char.id}`;
      if (scene.textures.exists(key)) return;

      const canvas = scene.textures.createCanvas(key, 96, 96);
      if (!canvas) return;
      const ctx = canvas.context;

      ctx.save();
      ctx.translate(48, 48);

      const mainStr = '#' + char.primaryColor.toString(16).padStart(6, '0');
      const secStr = '#' + char.secondaryColor.toString(16).padStart(6, '0');
      const glowStr = '#' + char.glowColor.toString(16).padStart(6, '0');

      switch (char.silhouetteType) {
        case 'sleek': // VOLT - Hero Athletic Sci-Fi Pilot
          // 1. Legs & Boots
          ctx.fillStyle = secStr;
          ctx.fillRect(-12, 12, 8, 22);
          ctx.fillRect(4, 12, 8, 22);
          ctx.fillStyle = mainStr;
          ctx.fillRect(-13, 26, 9, 12);
          ctx.fillRect(4, 26, 9, 12);
          // Knee Pads
          ctx.fillStyle = glowStr;
          ctx.fillRect(-11, 20, 6, 4);
          ctx.fillRect(5, 20, 6, 4);

          // 2. Torso & Chest Armor
          ctx.fillStyle = secStr;
          ctx.beginPath();
          ctx.moveTo(-16, -14); ctx.lineTo(16, -14);
          ctx.lineTo(11, 14); ctx.lineTo(-11, 14);
          ctx.closePath(); ctx.fill();

          ctx.fillStyle = mainStr;
          ctx.beginPath();
          ctx.moveTo(-12, -12); ctx.lineTo(12, -12);
          ctx.lineTo(7, 4); ctx.lineTo(-7, 4);
          ctx.closePath(); ctx.fill();

          // Chest Reactor Core
          ctx.fillStyle = glowStr;
          ctx.beginPath(); ctx.arc(0, -3, 6, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(0, -3, 2.5, 0, Math.PI * 2); ctx.fill();

          // 3. Shoulder Pauldrons & Arms
          ctx.fillStyle = mainStr;
          ctx.beginPath();
          ctx.arc(-18, -12, 7, 0, Math.PI * 2);
          ctx.arc(18, -12, 7, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = secStr;
          ctx.fillRect(-22, -7, 7, 18);
          ctx.fillRect(15, -7, 7, 18);
          ctx.fillStyle = mainStr;
          ctx.fillRect(-23, 4, 8, 8);
          ctx.fillRect(15, 4, 8, 8);

          // Suit Piping Accent Lines
          ctx.strokeStyle = glowStr; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(-18, -6); ctx.lineTo(-18, 8); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(18, -6); ctx.lineTo(18, 8); ctx.stroke();

          // 4. Helmet Shell & Visor
          ctx.fillStyle = '#0f172a';
          ctx.beginPath(); ctx.arc(0, -27, 13, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = mainStr; ctx.lineWidth = 2; ctx.stroke();

          // Visor Mask
          ctx.fillStyle = glowStr;
          ctx.beginPath();
          ctx.ellipse(3, -27, 9, 5, Math.PI / 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.ellipse(3, -28, 5, 2, Math.PI / 12, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'needle': // NOVA - Aerodynamic Speed Specialist
          // 1. Tapered Legs & Racing Boots
          ctx.fillStyle = secStr;
          ctx.beginPath();
          ctx.moveTo(-9, 10); ctx.lineTo(-3, 38); ctx.lineTo(-13, 38); ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(9, 10); ctx.lineTo(15, 38); ctx.lineTo(5, 38); ctx.closePath(); ctx.fill();

          ctx.strokeStyle = glowStr; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(-6, 12); ctx.lineTo(-4, 34); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(6, 12); ctx.lineTo(8, 34); ctx.stroke();

          // 2. Streamlined Torso & Narrow Waist
          ctx.fillStyle = mainStr;
          ctx.beginPath();
          ctx.moveTo(-13, -16); ctx.lineTo(13, -16);
          ctx.lineTo(6, 12); ctx.lineTo(-6, 12);
          ctx.closePath(); ctx.fill();

          // Golden Chest Core
          ctx.fillStyle = glowStr;
          ctx.beginPath(); ctx.arc(0, -4, 5, 0, Math.PI * 2); ctx.fill();

          // 3. Back-swept Aerodynamic Shoulder Fins & Lightweight Limbs
          ctx.fillStyle = secStr;
          ctx.beginPath();
          ctx.moveTo(-12, -18); ctx.lineTo(-24, -25); ctx.lineTo(-14, -6); ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(12, -18); ctx.lineTo(24, -25); ctx.lineTo(14, -6); ctx.closePath(); ctx.fill();

          ctx.fillStyle = mainStr;
          ctx.fillRect(-18, -9, 5, 20);
          ctx.fillRect(13, -9, 5, 20);

          // 4. Low-profile Speed Helmet & Narrow Visor
          ctx.fillStyle = '#1e1b4b';
          ctx.beginPath();
          ctx.moveTo(-10, -20); ctx.lineTo(13, -24); ctx.lineTo(11, -38); ctx.lineTo(-9, -34);
          ctx.closePath(); ctx.fill();

          ctx.fillStyle = glowStr;
          ctx.fillRect(2, -32, 10, 4);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(4, -32, 6, 2);
          break;

        case 'heavy': // TITAN - Heavy Armored Juggernaut
          // 1. Thick Legs & Heavy Steel Boots
          ctx.fillStyle = secStr;
          ctx.fillRect(-18, 10, 14, 28);
          ctx.fillRect(4, 10, 14, 28);
          ctx.fillStyle = mainStr;
          ctx.fillRect(-20, 24, 16, 14);
          ctx.fillRect(4, 24, 16, 14);

          // 2. Massive Torso & Reinforced Armor Plates
          ctx.fillStyle = '#18181b';
          ctx.fillRect(-22, -18, 44, 30);

          ctx.fillStyle = mainStr;
          ctx.fillRect(-19, -16, 38, 14);
          ctx.fillRect(-15, 0, 30, 10);

          // Glowing Orange Fusion Core
          ctx.fillStyle = glowStr;
          ctx.fillRect(-7, -9, 14, 9);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-3, -7, 6, 5);

          // 3. Heavy Shoulder Pauldrons & Gauntlets
          ctx.fillStyle = mainStr;
          ctx.fillRect(-31, -22, 13, 18);
          ctx.fillRect(18, -22, 13, 18);

          ctx.fillStyle = secStr;
          ctx.fillRect(-29, -4, 10, 22);
          ctx.fillRect(19, -4, 10, 22);

          // 4. Juggernaut Helmet & Broad Visor Slot
          ctx.fillStyle = '#27272a';
          ctx.fillRect(-13, -38, 26, 20);
          ctx.strokeStyle = mainStr; ctx.lineWidth = 2.5; ctx.strokeRect(-13, -38, 26, 20);

          ctx.fillStyle = glowStr;
          ctx.fillRect(-7, -31, 15, 6);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-3, -31, 7, 3);
          break;

        case 'winged': // ECHO - Emerald Agility Specialist
          // 1. Segmented Agile Legs & Boots
          ctx.fillStyle = secStr;
          ctx.fillRect(-10, 12, 7, 24);
          ctx.fillRect(3, 12, 7, 24);
          ctx.fillStyle = mainStr;
          ctx.fillRect(-11, 24, 8, 12);
          ctx.fillRect(3, 24, 8, 12);

          // 2. Flexible Torso & Mint Reactor Core
          ctx.fillStyle = secStr;
          ctx.beginPath(); ctx.ellipse(0, 0, 12, 16, 0, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = mainStr;
          ctx.beginPath(); ctx.ellipse(0, -4, 9, 10, 0, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = glowStr;
          ctx.beginPath(); ctx.arc(0, -4, 4.5, 0, Math.PI * 2); ctx.fill();

          // 3. Aerodynamic Shoulder Winglets
          ctx.fillStyle = glowStr;
          ctx.beginPath();
          ctx.moveTo(-10, -14); ctx.lineTo(-26, -28); ctx.lineTo(-12, -4); ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(10, -14); ctx.lineTo(26, -28); ctx.lineTo(12, -4); ctx.closePath(); ctx.fill();

          // 4. Curved Aerodynamic Helmet & Mint Visor Mask
          ctx.fillStyle = '#064e3b';
          ctx.beginPath(); ctx.arc(0, -25, 12, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = glowStr;
          ctx.beginPath(); ctx.ellipse(3, -25, 8, 5, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.ellipse(3, -26, 4, 2, 0, 0, Math.PI * 2); ctx.fill();
          break;

        case 'phase': // RIFT - Asymmetric Prototype Combat Suit
          // 1. Articulated Legs & Dark Metallic Boots
          ctx.fillStyle = secStr;
          ctx.fillRect(-12, 12, 9, 24);
          ctx.fillRect(3, 12, 9, 24);
          ctx.fillStyle = mainStr;
          ctx.fillRect(-13, 26, 10, 10);
          ctx.fillRect(3, 22, 10, 14);

          // 2. Asymmetric Torso Plates & Violet Core Ring
          ctx.fillStyle = secStr;
          ctx.fillRect(-14, -16, 28, 28);

          ctx.fillStyle = mainStr;
          ctx.beginPath();
          ctx.moveTo(-14, -16); ctx.lineTo(6, -16); ctx.lineTo(12, 8); ctx.lineTo(-8, 10);
          ctx.closePath(); ctx.fill();

          ctx.strokeStyle = glowStr; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(0, -4, 8, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(0, -4, 3.5, 0, Math.PI * 2); ctx.fill();

          // 3. Asymmetric Shoulder Plates & Energy Conduits
          ctx.fillStyle = mainStr;
          ctx.fillRect(-22, -18, 9, 14);
          ctx.fillRect(15, -14, 8, 12);

          // 4. Prototype Sci-Fi Helmet & Angled Optical Visor
          ctx.fillStyle = '#1e1b4b';
          ctx.beginPath(); ctx.arc(0, -26, 12, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = glowStr;
          ctx.beginPath(); ctx.arc(4, -26, 4.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(4, -26, 2, 0, Math.PI * 2); ctx.fill();
          break;
      }

      ctx.restore();
      canvas.refresh();
    });
  }

  // --- JETPACKS ---
  private static generateJetpacks(scene: Phaser.Scene): void {
    JETPACKS.forEach((jp) => {
      const key = `jp_${jp.id}`;
      if (scene.textures.exists(key)) return;

      const canvas = scene.textures.createCanvas(key, 48, 48);
      if (!canvas) return;
      const ctx = canvas.context;

      ctx.save();
      ctx.translate(24, 24);

      const flameStr = '#' + jp.flameColor.toString(16).padStart(6, '0');

      switch (jp.exhaustType) {
        case 'dual_vector':
          ctx.fillStyle = '#334155';
          ctx.fillRect(-14, -14, 14, 28);
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(-18, -16, 10, 12);
          ctx.fillRect(-18, 4, 10, 12);

          ctx.strokeStyle = flameStr; ctx.lineWidth = 2;
          ctx.strokeRect(-18, -16, 10, 12);
          ctx.strokeRect(-18, 4, 10, 12);
          break;

        case 'twin_overdrive':
          ctx.fillStyle = '#1e1b4b';
          ctx.beginPath();
          ctx.moveTo(-16, -18); ctx.lineTo(6, -10); ctx.lineTo(6, 10); ctx.lineTo(-16, 18);
          ctx.closePath(); ctx.fill();

          ctx.fillStyle = flameStr;
          ctx.beginPath();
          ctx.arc(-12, -10, 6, 0, Math.PI * 2);
          ctx.arc(-12, 10, 6, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'heavy_fusion':
          ctx.fillStyle = '#18181b';
          ctx.fillRect(-18, -16, 18, 32);
          ctx.fillStyle = '#22c55e';
          ctx.beginPath(); ctx.arc(-9, 0, 8, 0, Math.PI * 2); ctx.fill();

          ctx.strokeStyle = flameStr; ctx.lineWidth = 3;
          ctx.strokeRect(-18, -16, 18, 32);
          break;
      }

      ctx.restore();
      canvas.refresh();
    });
  }

  // --- WEAPONS ---
  private static generateWeapons(scene: Phaser.Scene): void {
    WEAPONS.forEach((wp) => {
      const key = `wp_${wp.id}`;
      if (scene.textures.exists(key)) return;

      const canvas = scene.textures.createCanvas(key, 48, 32);
      if (!canvas) return;
      const ctx = canvas.context;

      ctx.save();
      ctx.translate(24, 16);

      const glowStr = '#' + wp.glowColor.toString(16).padStart(6, '0');

      switch (wp.type) {
        case 'pulse_blaster':
          ctx.fillStyle = '#334155';
          ctx.fillRect(-12, -6, 24, 12);
          ctx.fillStyle = glowStr;
          ctx.fillRect(4, -8, 14, 4);
          ctx.fillRect(4, 4, 14, 4);
          break;

        case 'plasma_cannon':
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(-14, -9, 28, 18);
          ctx.fillStyle = glowStr;
          ctx.beginPath();
          ctx.arc(8, 0, 7, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'shockwave':
          ctx.fillStyle = '#2e1065';
          ctx.beginPath();
          ctx.arc(0, 0, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = glowStr; ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, 14, -Math.PI / 3, Math.PI / 3);
          ctx.stroke();
          break;
      }

      ctx.restore();
      canvas.refresh();
    });
  }

  // --- PROJECTILES ---
  private static generateProjectiles(scene: Phaser.Scene): void {
    if (!scene.textures.exists('proj_pulse')) {
      const canvas = scene.textures.createCanvas('proj_pulse', 32, 12);
      if (canvas) {
        const ctx = canvas.context;
        const grad = ctx.createLinearGradient(0, 6, 32, 6);
        grad.addColorStop(0, 'rgba(0, 240, 255, 0)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(1, 'rgba(0, 240, 255, 0.9)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 2, 32, 8);
        canvas.refresh();
      }
    }

    if (!scene.textures.exists('proj_plasma')) {
      const canvas = scene.textures.createCanvas('proj_plasma', 32, 32);
      if (canvas) {
        const ctx = canvas.context;
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.4, 'rgba(255, 80, 0, 0.9)');
        grad.addColorStop(0.8, 'rgba(255, 200, 0, 0.5)');
        grad.addColorStop(1, 'rgba(255, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
        canvas.refresh();
      }
    }

    if (!scene.textures.exists('proj_shockwave')) {
      const canvas = scene.textures.createCanvas('proj_shockwave', 64, 64);
      if (canvas) {
        const ctx = canvas.context;
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.9)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(32, 32, 28, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(232, 121, 249, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(32, 32, 22, 0, Math.PI * 2);
        ctx.stroke();
        canvas.refresh();
      }
    }
  }

  // --- TRACK ELEMENTS ---
  private static generateTrackElements(scene: Phaser.Scene): void {
    if (!scene.textures.exists('tex_speed_zone')) {
      const canvas = scene.textures.createCanvas('tex_speed_zone', 128, 64);
      if (canvas) {
        const ctx = canvas.context;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.fillRect(0, 0, 128, 64);
        ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, 128, 64);

        ctx.fillStyle = '#34d399';
        for (let x = 20; x < 120; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 16); ctx.lineTo(x + 20, 32); ctx.lineTo(x, 48);
          ctx.closePath(); ctx.fill();
        }
        canvas.refresh();
      }
    }

    if (!scene.textures.exists('tex_boost_pad')) {
      const canvas = scene.textures.createCanvas('tex_boost_pad', 120, 40);
      if (canvas) {
        const ctx = canvas.context;
        ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.fillRect(0, 0, 120, 40);
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, 120, 40);

        ctx.fillStyle = '#fbbf24';
        for (let x = 15; x < 110; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 8); ctx.lineTo(x + 18, 20); ctx.lineTo(x, 32);
          ctx.closePath(); ctx.fill();
        }
        canvas.refresh();
      }
    }

    if (!scene.textures.exists('tex_laser_barrier')) {
      const canvas = scene.textures.createCanvas('tex_laser_barrier', 20, 160);
      if (canvas) {
        const ctx = canvas.context;
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, 20, 20);
        ctx.fillRect(0, 140, 20, 20);

        const grad = ctx.createLinearGradient(10, 20, 10, 140);
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.9)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(1, 'rgba(239, 68, 68, 0.9)');
        ctx.fillStyle = grad;
        ctx.fillRect(6, 20, 8, 120);
        canvas.refresh();
      }
    }

    if (!scene.textures.exists('tex_drone')) {
      const canvas = scene.textures.createCanvas('tex_drone', 40, 40);
      if (canvas) {
        const ctx = canvas.context;
        ctx.fillStyle = '#334155';
        ctx.beginPath(); ctx.arc(20, 20, 14, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(20, 20, 6, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(4, 20); ctx.lineTo(36, 20);
        ctx.moveTo(20, 4); ctx.lineTo(20, 36);
        ctx.stroke();
        canvas.refresh();
      }
    }

    if (!scene.textures.exists('tex_energy_pickup')) {
      const canvas = scene.textures.createCanvas('tex_energy_pickup', 24, 24);
      if (canvas) {
        const ctx = canvas.context;
        const grad = ctx.createRadialGradient(12, 12, 0, 12, 12, 12);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.5, '#00f0ff');
        grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(12, 12, 11, 0, Math.PI * 2); ctx.fill();
        canvas.refresh();
      }
    }
  }

  // --- GAMEPLAY READABILITY PASS: DARK CINEMATIC NIGHT MEGACITY PARALLAX ---
  private static generateCityParallax(scene: Phaser.Scene): void {
    // Parallax Layer 1: Dark Navy & Deep Blue-Purple Sky (1280x720)
    if (!scene.textures.exists('bg_city_far')) {
      const canvas = scene.textures.createCanvas('bg_city_far', 1280, 720);
      if (canvas) {
        const ctx = canvas.context;

        // Dark Navy / Deep Blue Sky Gradient: #030712 -> #090d20 -> #161633 -> #1e1b4b
        const grad = ctx.createLinearGradient(0, 0, 0, 720);
        grad.addColorStop(0, '#030712');    // Deep Space Black
        grad.addColorStop(0.35, '#090d20'); // Dark Navy
        grad.addColorStop(0.70, '#161633'); // Deep Blue-Indigo
        grad.addColorStop(1.0, '#1e1b4b');  // Muted Night Purple
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1280, 720);

        // Subtle, low-intensity Cyan/Blue Horizon Glow
        const horizonGlow = ctx.createLinearGradient(0, 480, 0, 720);
        horizonGlow.addColorStop(0, 'rgba(0, 180, 216, 0)');
        horizonGlow.addColorStop(1, 'rgba(0, 180, 216, 0.15)');
        ctx.fillStyle = horizonGlow;
        ctx.fillRect(0, 480, 1280, 240);

        // Muted, Low-Contrast Distant Building Silhouettes
        ctx.fillStyle = '#0b0f19';
        for (let x = 0; x < 1280; x += 40) {
          const h = 180 + Math.sin(x * 0.04) * 80 + (x % 5) * 20;
          ctx.fillRect(x, 720 - h, 36, h);
        }

        // Soft Atmospheric Depth Haze (mutes background)
        const depthHaze = ctx.createLinearGradient(0, 360, 0, 720);
        depthHaze.addColorStop(0, 'rgba(15, 23, 42, 0)');
        depthHaze.addColorStop(1, 'rgba(15, 23, 42, 0.55)');
        ctx.fillStyle = depthHaze;
        ctx.fillRect(0, 360, 1280, 360);

        canvas.refresh();
      }
    }

    // Parallax Layer 2: Midground Muted Skyscrapers with Sparse Dim Windows (1280x720)
    if (!scene.textures.exists('bg_city_mid')) {
      const canvas = scene.textures.createCanvas('bg_city_mid', 1280, 720);
      if (canvas) {
        const ctx = canvas.context;

        // Dark Blue-Gray Skyscrapers (#0f172a / #172033)
        const bldProps = [
          { x: 0, w: 110, h: 420 },
          { x: 120, w: 75, h: 310 },
          { x: 205, w: 130, h: 460 },
          { x: 345, w: 90, h: 330 },
          { x: 445, w: 140, h: 440 },
          { x: 595, w: 80, h: 300 },
          { x: 685, w: 125, h: 430 },
          { x: 820, w: 95, h: 320 },
          { x: 925, w: 135, h: 470 },
          { x: 1070, w: 85, h: 310 },
          { x: 1165, w: 115, h: 420 },
        ];

        bldProps.forEach((bld) => {
          const startY = 720 - bld.h;

          // Main Dark Building Body
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(bld.x, startY, bld.w, bld.h);

          // Subtle Facade Inset
          ctx.fillStyle = '#172033';
          ctx.fillRect(bld.x + 4, startY + 4, bld.w - 8, bld.h - 4);

          // Sparse, Dim, Cool Cyan Window Accent Lights (Low Opacity, No Bright Yellow/Magenta)
          ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
          for (let wy = startY + 36; wy < 680; wy += 32) {
            for (let wx = bld.x + 14; wx < bld.x + bld.w - 18; wx += 24) {
              if ((wx + wy) % 5 === 0) {
                ctx.fillRect(wx, wy, 8, 12);
              }
            }
          }
        });

        // Dark Elevated Sky Bridges
        const skyBridges = [
          { y: 390, x1: 100, x2: 350 },
          { y: 310, x1: 440, x2: 690 },
          { y: 360, x1: 820, x2: 1070 },
        ];

        skyBridges.forEach((sb) => {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(sb.x1, sb.y, sb.x2 - sb.x1, 10);
        });

        canvas.refresh();
      }
    }

    // Parallax Layer 3: Subtle Dark Foreground Framing (1280x720)
    if (!scene.textures.exists('bg_city_fore')) {
      const canvas = scene.textures.createCanvas('bg_city_fore', 1280, 720);
      if (canvas) {
        const ctx = canvas.context;

        // Low-Opacity Dark Structural Framing at Extreme Edges (No bright hazard lines across flight corridor)
        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.fillRect(0, 0, 1280, 20);   // Top edge rail
        ctx.fillRect(0, 700, 1280, 20); // Bottom edge rail

        canvas.refresh();
      }
    }

    // Dim, Small Flying Traffic Sprite (Subtle Background Movement)
    if (!scene.textures.exists('tex_flying_car_dim')) {
      const canvas = scene.textures.createCanvas('tex_flying_car_dim', 24, 8);
      if (canvas) {
        const ctx = canvas.context;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 1, 24, 6);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.fillRect(16, 2, 6, 4);
        canvas.refresh();
      }
    }
  }

  // --- BOSS ASSETS ---
  private static generateBossAssets(scene: Phaser.Scene): void {
    // 1. Neon Behemoth Body (240x180)
    if (!scene.textures.exists('boss_neon_behemoth')) {
      const canvas = scene.textures.createCanvas('boss_neon_behemoth', 240, 180);
      if (canvas) {
        const ctx = canvas.context;
        ctx.save();
        ctx.translate(120, 90);

        // Dark Metallic Wings & Heavy Turbines
        ctx.fillStyle = '#0f172a';
        // Top Wing
        ctx.beginPath();
        ctx.moveTo(-40, -20); ctx.lineTo(-100, -75); ctx.lineTo(60, -75); ctx.lineTo(100, -25);
        ctx.closePath(); ctx.fill();
        // Bottom Wing
        ctx.beginPath();
        ctx.moveTo(-40, 20); ctx.lineTo(-100, 75); ctx.lineTo(60, 75); ctx.lineTo(100, 25);
        ctx.closePath(); ctx.fill();

        // Inner Hull Armor
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(-70, -35); ctx.lineTo(80, -35); ctx.lineTo(110, 0); ctx.lineTo(80, 35); ctx.lineTo(-70, 35);
        ctx.closePath(); ctx.fill();

        // Cyan & Magenta Metallic Trims
        ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 3;
        ctx.strokeRect(-65, -30, 140, 60);

        ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-95, -70); ctx.lineTo(55, -70);
        ctx.moveTo(-95, 70); ctx.lineTo(55, 70);
        ctx.stroke();

        // Thruster Vents
        ctx.fillStyle = '#ff5500';
        ctx.fillRect(-110, -50, 12, 24);
        ctx.fillRect(-110, 26, 12, 24);

        // Core Mounting Ring
        ctx.fillStyle = '#0284c7';
        ctx.beginPath(); ctx.arc(0, 0, 28, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, 28, 0, Math.PI * 2); ctx.stroke();

        ctx.restore();
        canvas.refresh();
      }
    }

    // 2. Boss Core States (44x44)
    if (!scene.textures.exists('boss_core_normal')) {
      const canvas = scene.textures.createCanvas('boss_core_normal', 44, 44);
      if (canvas) {
        const ctx = canvas.context;
        const grad = ctx.createRadialGradient(22, 22, 0, 22, 22, 22);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, '#00f0ff');
        grad.addColorStop(1, 'rgba(0, 180, 216, 0.2)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(22, 22, 20, 0, Math.PI * 2); ctx.fill();
        canvas.refresh();
      }
    }

    if (!scene.textures.exists('boss_core_exposed')) {
      const canvas = scene.textures.createCanvas('boss_core_exposed', 44, 44);
      if (canvas) {
        const ctx = canvas.context;
        const grad = ctx.createRadialGradient(22, 22, 0, 22, 22, 22);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, '#f59e0b');
        grad.addColorStop(0.8, '#ef4444');
        grad.addColorStop(1, 'rgba(239, 68, 68, 0.3)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(22, 22, 20, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(22, 22, 20, 0, Math.PI * 2); ctx.stroke();
        canvas.refresh();
      }
    }

    // 3. Boss Laser Beam (1280x50)
    if (!scene.textures.exists('boss_laser_beam')) {
      const canvas = scene.textures.createCanvas('boss_laser_beam', 1280, 50);
      if (canvas) {
        const ctx = canvas.context;
        const grad = ctx.createLinearGradient(0, 0, 0, 50);
        grad.addColorStop(0, 'rgba(244, 63, 94, 0)');
        grad.addColorStop(0.25, 'rgba(244, 63, 94, 0.9)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.75, 'rgba(244, 63, 94, 0.9)');
        grad.addColorStop(1, 'rgba(244, 63, 94, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1280, 50);
        canvas.refresh();
      }
    }

    // 4. Boss Warning Line (1280x60)
    if (!scene.textures.exists('boss_warning_line')) {
      const canvas = scene.textures.createCanvas('boss_warning_line', 1280, 60);
      if (canvas) {
        const ctx = canvas.context;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.fillRect(0, 0, 1280, 60);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, 1280, 60);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let x = 20; x < 1280; x += 100) {
          ctx.fillRect(x, 26, 60, 8);
        }
        canvas.refresh();
      }
    }

    // 5. Boss Cannon Projectile (24x12)
    if (!scene.textures.exists('boss_proj_cannon')) {
      const canvas = scene.textures.createCanvas('boss_proj_cannon', 24, 12);
      if (canvas) {
        const ctx = canvas.context;
        const grad = ctx.createLinearGradient(0, 6, 24, 6);
        grad.addColorStop(0, 'rgba(244, 63, 94, 0.2)');
        grad.addColorStop(0.5, '#ffffff');
        grad.addColorStop(1, '#f43f5e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 2, 24, 8);
        canvas.refresh();
      }
    }

    // 6. Boss Missile (28x14)
    if (!scene.textures.exists('boss_proj_missile')) {
      const canvas = scene.textures.createCanvas('boss_proj_missile', 28, 14);
      if (canvas) {
        const ctx = canvas.context;
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(0, 7); ctx.lineTo(20, 2); ctx.lineTo(28, 7); ctx.lineTo(20, 12);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(22, 5, 4, 4);
        canvas.refresh();
      }
    }

    // 7. Boss Shockwave Ring (80x80)
    if (!scene.textures.exists('boss_shockwave')) {
      const canvas = scene.textures.createCanvas('boss_shockwave', 80, 80);
      if (canvas) {
        const ctx = canvas.context;
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.9)'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(40, 40, 36, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(40, 40, 28, 0, Math.PI * 2); ctx.stroke();
        canvas.refresh();
      }
    }

    // 8. Boss Arena Background Layers
    if (!scene.textures.exists('bg_arena_far')) {
      const canvas = scene.textures.createCanvas('bg_arena_far', 1280, 720);
      if (canvas) {
        const ctx = canvas.context;
        const grad = ctx.createLinearGradient(0, 0, 0, 720);
        grad.addColorStop(0, '#020617');
        grad.addColorStop(0.5, '#090d20');
        grad.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1280, 720);

        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)'; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(640, 360, 320, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.15)'; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.arc(640, 360, 220, 0, Math.PI * 2); ctx.stroke();

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)'; ctx.lineWidth = 1;
        for (let x = 0; x < 1280; x += 80) ctx.strokeRect(x, 0, 80, 720);

        canvas.refresh();
      }
    }

    if (!scene.textures.exists('bg_arena_mid')) {
      const canvas = scene.textures.createCanvas('bg_arena_mid', 1280, 720);
      if (canvas) {
        const ctx = canvas.context;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 1280, 40);
        ctx.fillRect(0, 680, 1280, 40);

        ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.fillRect(0, 36, 1280, 4);
        ctx.fillRect(0, 680, 1280, 4);

        canvas.refresh();
      }
    }
  }

  // --- UI ASSETS ---
  private static generateUIAssets(scene: Phaser.Scene): void {
    // 1. Primary Button (START RACE CTA) - 300x58
    if (!scene.textures.exists('ui_button_primary')) {
      const canvas = scene.textures.createCanvas('ui_button_primary', 300, 58);
      if (canvas) {
        const ctx = canvas.context;
        const grad = ctx.createLinearGradient(0, 0, 300, 58);
        grad.addColorStop(0, 'rgba(10, 37, 64, 0.95)');
        grad.addColorStop(0.5, 'rgba(14, 55, 90, 0.95)');
        grad.addColorStop(1, 'rgba(10, 37, 64, 0.95)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 300, 58);

        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, 300, 58);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.strokeRect(3, 3, 294, 52);

        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(0, 0, 10, 10);
        ctx.fillRect(290, 0, 10, 10);
        ctx.fillRect(0, 48, 10, 10);
        ctx.fillRect(290, 48, 10, 10);

        canvas.refresh();
      }
    }

    // 2. Secondary Button - 300x58
    if (!scene.textures.exists('ui_button')) {
      const canvas = scene.textures.createCanvas('ui_button', 300, 58);
      if (canvas) {
        const ctx = canvas.context;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(0, 0, 300, 58);

        ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, 300, 58);

        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(0, 0, 6, 6);
        ctx.fillRect(294, 52, 6, 6);
        canvas.refresh();
      }
    }
  }
}
