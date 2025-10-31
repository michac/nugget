import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    // Constants from pygame version
    this.PADDLE_SPEED = 8;
    this.BALL_SPEED = 240; // Phaser uses pixels per second, pygame was 4 pixels per frame at 60fps
    this.BRICK_ROWS = 5;
    this.BRICK_COLS = 10;
    this.BRICK_SPACING = 5;

    // Game state
    this.gameOver = false;
    this.won = false;
    this.ballLaunched = false;

    // Create paddle
    this.paddle = this.add.rectangle(400, 550, 120, 20, 0xffffff);
    this.physics.add.existing(this.paddle);
    this.paddle.body.setImmovable(true);
    this.paddle.body.setCollideWorldBounds(true);

    // Create ball with nugget sprite (start attached to paddle)
    this.ball = this.physics.add.sprite(400, 520, 'nugget');
    this.ball.setDisplaySize(30, 30);
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1, 1);
    this.ball.setVelocity(0, 0); // Start stationary

    // Create bricks as a static group (more efficient and properly immovable)
    this.bricks = this.physics.add.staticGroup();
    this.createBricks();

    // Load sound
    this.fartSound = this.sound.add('fart');

    // Set up keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Set up collisions
    this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);
    this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);

    // UI Text elements (created but hidden initially)
    this.gameOverText = this.add.text(400, 300, '', {
      fontSize: '72px',
      color: '#ffffff',
      fontFamily: 'Arial'
    });
    this.gameOverText.setOrigin(0.5);

    this.restartText = this.add.text(400, 360, 'Press SPACE to play again', {
      fontSize: '36px',
      color: '#ffffff',
      fontFamily: 'Arial'
    });
    this.restartText.setOrigin(0.5);
    this.restartText.setVisible(false);

    // Launch instruction text
    this.launchText = this.add.text(400, 450, 'Press SPACE to launch', {
      fontSize: '36px',
      color: '#ffffff',
      fontFamily: 'Arial'
    });
    this.launchText.setOrigin(0.5);

    // Check for ball falling off bottom
    this.physics.world.on('worldbounds', (body) => {
      if (body.gameObject === this.ball && body.blocked.down) {
        this.ballFellOff();
      }
    });
    this.ball.body.onWorldBounds = true;
  }

  createBricks() {
    const brickWidth = (800 - (this.BRICK_COLS + 1) * this.BRICK_SPACING) / this.BRICK_COLS;
    const brickHeight = 30;
    const startY = 80;

    for (let row = 0; row < this.BRICK_ROWS; row++) {
      for (let col = 0; col < this.BRICK_COLS; col++) {
        const x = col * (brickWidth + this.BRICK_SPACING) + this.BRICK_SPACING + brickWidth / 2;
        const y = row * (brickHeight + this.BRICK_SPACING) + startY + brickHeight / 2;

        // Use create() for static groups - automatically makes them immovable
        const brick = this.bricks.create(x, y, 'burger');
        brick.setDisplaySize(brickWidth, brickHeight);
        // Refresh the physics body after resizing
        brick.refreshBody();
      }
    }
  }

  hitPaddle(ball, paddle) {
    // Play fart sound
    this.fartSound.play();

    // Add horizontal velocity based on where ball hits paddle
    const hitPos = (ball.x - paddle.x) / (paddle.width / 2);
    ball.setVelocityX(hitPos * this.BALL_SPEED);
  }

  hitBrick(ball, brick) {
    // Disable the brick's body (hides and disables physics without destroying)
    // This is the Phaser-recommended way that doesn't interfere with collision physics
    brick.disableBody(true, true);

    // Check win condition
    if (this.bricks.countActive() === 0) {
      this.gameOver = true;
      this.won = true;
      this.showGameOver();
    }
  }

  ballFellOff() {
    if (!this.gameOver) {
      this.gameOver = true;
      this.won = false;
      this.showGameOver();
    }
  }

  showGameOver() {
    // Stop ball
    this.ball.setVelocity(0, 0);
    this.ball.setVisible(false);

    // Show appropriate message
    if (this.won) {
      this.gameOverText.setText('YOU WIN!');
      this.gameOverText.setColor('#ffd700'); // Gold color
    } else {
      this.gameOverText.setText('GAME OVER');
      this.gameOverText.setColor('#ffffff');
    }

    this.restartText.setVisible(true);
    this.launchText.setVisible(false);
  }

  resetGame() {
    // Reset game state
    this.gameOver = false;
    this.won = false;
    this.ballLaunched = false;

    // Reset ball (attached to paddle)
    this.ball.setPosition(400, 520);
    this.ball.setVelocity(0, 0);
    this.ball.setVisible(true);

    // Reset paddle
    this.paddle.setPosition(400, 550);

    // Recreate bricks
    this.bricks.clear(true, true);
    this.createBricks();

    // Hide UI text
    this.gameOverText.setText('');
    this.restartText.setVisible(false);
    this.launchText.setVisible(true);
  }

  update() {
    if (!this.gameOver) {
      // Paddle movement
      if (this.cursors.left.isDown) {
        this.paddle.x -= this.PADDLE_SPEED;
        // Keep paddle in bounds
        if (this.paddle.x < this.paddle.width / 2) {
          this.paddle.x = this.paddle.width / 2;
        }
      } else if (this.cursors.right.isDown) {
        this.paddle.x += this.PADDLE_SPEED;
        // Keep paddle in bounds
        if (this.paddle.x > 800 - this.paddle.width / 2) {
          this.paddle.x = 800 - this.paddle.width / 2;
        }
      }

      // Update paddle physics body position
      this.paddle.body.updateFromGameObject();

      // If ball not launched, attach it to paddle
      if (!this.ballLaunched) {
        this.ball.x = this.paddle.x;
        this.ball.y = this.paddle.y - 30;

        // Launch ball on spacebar
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
          this.ballLaunched = true;
          this.ball.setVelocity(this.BALL_SPEED, -this.BALL_SPEED);
          this.launchText.setVisible(false);
        }
      }
    } else {
      // Check for restart
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.resetGame();
      }
    }
  }
}
