export interface TrackElement {
  id: string;
  type: 'speed_zone' | 'boost_pad' | 'energy_gate' | 'laser_barrier' | 'drone' | 'energy_pickup' | 'obstacle';
  x: number;
  y: number;
  width?: number;
  height?: number;
  moving?: boolean;
  moveRangeY?: number;
  moveSpeed?: number;
}

export interface LevelData {
  id: string;
  name: string;
  worldName: string;
  trackLength: number; // total X coordinate for 100% completion
  startY: number;
  minY: number;
  maxY: number;
  bgColors: number[];
  elements: TrackElement[];
}

export const NEON_DISTRICT_LEVEL: LevelData = {
  id: 'neon_district',
  name: 'NEON DISTRICT',
  worldName: 'WORLD 1',
  trackLength: 16000,
  startY: 360,
  minY: 100,
  maxY: 620,
  bgColors: [0x050515, 0x0f172a, 0x1e1b4b],
  elements: [
    // --- START SECTION (0m - 2000m) ---
    { id: 'bp_1', type: 'boost_pad', x: 800, y: 400, width: 120, height: 40 },
    { id: 'sz_1', type: 'speed_zone', x: 1500, y: 300, width: 250, height: 140 },
    { id: 'ep_1', type: 'energy_pickup', x: 1200, y: 350 },
    { id: 'ep_2', type: 'energy_pickup', x: 1250, y: 320 },
    { id: 'ep_3', type: 'energy_pickup', x: 1300, y: 350 },

    // --- TUNNEL 1 & HAZARDS (2000m - 5000m) ---
    { id: 'lb_1', type: 'laser_barrier', x: 2200, y: 200, width: 20, height: 260, moving: true, moveRangeY: 100, moveSpeed: 80 },
    { id: 'dr_1', type: 'drone', x: 2800, y: 350, moving: true, moveRangeY: 120, moveSpeed: 100 },
    { id: 'dr_2', type: 'drone', x: 3200, y: 250, moving: true, moveRangeY: 150, moveSpeed: 120 },
    { id: 'bp_2', type: 'boost_pad', x: 3600, y: 500, width: 120, height: 40 },
    { id: 'eg_1', type: 'energy_gate', x: 4200, y: 360, width: 40, height: 280 },
    { id: 'ep_4', type: 'energy_pickup', x: 4500, y: 250 },
    { id: 'ep_5', type: 'energy_pickup', x: 4550, y: 250 },

    // --- MID TRACK (5000m - 10000m) ---
    { id: 'sz_2', type: 'speed_zone', x: 5500, y: 250, width: 300, height: 160 },
    { id: 'lb_2', type: 'laser_barrier', x: 6200, y: 380, width: 20, height: 240, moving: true, moveRangeY: 80, moveSpeed: 90 },
    { id: 'ob_1', type: 'obstacle', x: 6800, y: 300, width: 60, height: 160 },
    { id: 'bp_3', type: 'boost_pad', x: 7400, y: 280, width: 120, height: 40 },
    { id: 'dr_3', type: 'drone', x: 8000, y: 450, moving: true, moveRangeY: 100, moveSpeed: 110 },
    { id: 'dr_4', type: 'drone', x: 8600, y: 200, moving: true, moveRangeY: 120, moveSpeed: 130 },
    { id: 'eg_2', type: 'energy_gate', x: 9300, y: 360, width: 40, height: 300 },

    // --- FINAL STRETCH (10000m - 16000m) ---
    { id: 'sz_3', type: 'speed_zone', x: 10500, y: 350, width: 400, height: 200 },
    { id: 'lb_3', type: 'laser_barrier', x: 11500, y: 150, width: 20, height: 300, moving: true, moveRangeY: 120, moveSpeed: 140 },
    { id: 'dr_5', type: 'drone', x: 12200, y: 300, moving: true, moveRangeY: 140, moveSpeed: 150 },
    { id: 'bp_4', type: 'boost_pad', x: 13000, y: 400, width: 150, height: 40 },
    { id: 'ob_2', type: 'obstacle', x: 13800, y: 250, width: 80, height: 200 },
    { id: 'bp_5', type: 'boost_pad', x: 14500, y: 360, width: 150, height: 40 },
    { id: 'ep_6', type: 'energy_pickup', x: 15000, y: 360 },
    { id: 'ep_7', type: 'energy_pickup', x: 15100, y: 360 },
  ],
};
