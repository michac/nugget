import Phaser from 'phaser';
import Preload from './scenes/Preload.js';
import Game from './scenes/Game.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#141e32',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [Preload, Game]
};

new Phaser.Game(config);
