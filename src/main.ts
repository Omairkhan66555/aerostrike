import Phaser from 'phaser';
import { GAME_CONFIG } from './config/gameConfig';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { CharacterSelectScene } from './scenes/CharacterSelectScene';
import { RaceScene } from './scenes/RaceScene';
import { RaceCompleteScene } from './scenes/RaceCompleteScene';
import { World1BossScene } from './scenes/World1BossScene';
import { World1VictoryScene } from './scenes/World1VictoryScene';

// Register all game scenes
const config: Phaser.Types.Core.GameConfig = {
  ...GAME_CONFIG,
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    CharacterSelectScene,
    RaceScene,
    RaceCompleteScene,
    World1BossScene,
    World1VictoryScene,
  ],
};

window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
  (window as any).game = game;
});
