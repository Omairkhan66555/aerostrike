export interface JetpackStats {
  thrust: number;         // 1 to 10 scale
  boostPower: number;     // 1 to 10 scale
  boostDuration: number;  // 1 to 10 scale
  energyEfficiency: number; // 1 to 10 scale
  stability: number;      // 1 to 10 scale (knockback & spinout resistance)
}

export interface JetpackData {
  id: string;
  name: string;
  type: string;
  stats: JetpackStats;
  description: string;
  flameColor: number;
  trailColor: number;
  exhaustType: 'dual_vector' | 'twin_overdrive' | 'heavy_fusion';
}
