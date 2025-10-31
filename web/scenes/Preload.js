import Phaser from 'phaser';

export default class Preload extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    // Load images
    this.load.image('nugget', 'assets/nugget.png');
    this.load.image('burger', 'assets/burger_brick.png');

    // Load audio
    this.load.audio('fart', 'assets/fart.ogg');

    // Display loading text
    const loadingText = this.add.text(400, 300, 'Loading...', {
      fontSize: '32px',
      color: '#ffffff'
    });
    loadingText.setOrigin(0.5);

    this.load.on('complete', () => {
      loadingText.destroy();
    });
  }

  create() {
    // Start the game scene
    this.scene.start('Game');
  }
}
