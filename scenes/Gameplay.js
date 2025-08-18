let paddle, ball, bricks, infoText;
let gameOver = false;

function create() {
  gameOver = false;

  let g = this.add.graphics();
  g.fillStyle(0x00ff00, 1);
  g.fillRoundedRect(0, 0, 100, 20, 10);
  g.lineStyle(2, 0x004400, 1);
  g.strokeRoundedRect(0, 0, 100, 20, 10);
  g.generateTexture("paddle", 100, 20);

  g.clear();
  g.fillStyle(0xff5555, 1);
  g.fillRoundedRect(0, 0, 50, 20, 5);
  g.lineStyle(2, 0xaa0000, 1);
  g.strokeRoundedRect(0, 0, 50, 20, 5);
  g.generateTexture("brick", 50, 20);

  g.clear();
  g.fillStyle(0xffffff, 1);
  g.fillCircle(10, 10, 10);
  g.lineStyle(2, 0xaaaaaa, 1);
  g.strokeCircle(10, 10, 10);
  g.generateTexture("ball", 20, 20);

  paddle = this.physics.add.image(400, 550, "paddle").setImmovable();
  paddle.body.allowGravity = false;
  paddle.setCollideWorldBounds(true);

  ball = this.physics.add.image(400, 520, "ball");
  ball.setCollideWorldBounds(true);
  ball.setBounce(1);
  ball.setVelocity(150, -150);
  ball.body.onWorldBounds = true;

  this.physics.world.on('worldbounds', (body, up, down) => {
    if (body.gameObject === ball && down) {
      gameOver = true;
      infoText.setText("Game Over (R para reiniciar)");
      infoText.setX((this.sys.game.config.width - infoText.width) / 2);
      infoText.setY((this.sys.game.config.height - infoText.height) / 2);
      ball.setVelocity(0, 0);
      ball.setVisible(false);
    }
  });

  bricks = this.physics.add.staticGroup();
  for (let y = 100; y < 200; y += 30) {
    for (let x = 80; x < 720; x += 60) {
      bricks.create(x, y, "brick");
    }
  }

  this.physics.add.collider(ball, paddle, hitPaddle, null, this);
  this.physics.add.collider(ball, bricks, hitBrick, null, this);

  this.cursors = this.input.keyboard.createCursorKeys();
  this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

  infoText = this.add.text(0, 20, "Brick Breaker", { fontSize: "28px", fill: "#fff" });
  infoText.setX((this.sys.game.config.width - infoText.width) / 2);
}

function update() {
  const speed = 300;

  if (!gameOver) {
    if (this.cursors.left.isDown) {
      paddle.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      paddle.setVelocityX(speed);
    } else {
      paddle.setVelocityX(0);
    }
  } else {
    if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
      this.scene.restart();
    }
  }
}

function hitPaddle(ball, paddle) {
  let diff = ball.x - paddle.x;
  ball.setVelocityX(diff * 5);
}

function hitBrick(ball, brick) {
  brick.disableBody(true, true);

  if (bricks.countActive() === 0) {
    gameOver = true;
    infoText.setText("¡Ganaste! R para reiniciar");
    infoText.setX((this.sys.game.config.width - infoText.width) / 2);
    infoText.setY((this.sys.game.config.height - infoText.height) / 2);
    ball.setVelocity(0, 0);
    ball.setVisible(false);
  }
}

export default {
  create,
  update
};