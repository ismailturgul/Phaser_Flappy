import Phaser from "phaser";

const PIPES_TO_RENDER = 2;

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");
    this.config = config;
    this.bird = null;
    this.pipes = null;
    this.pipeVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [400, 500];
    this.flapVelocity = 250;
  }
  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
  }

  create() {
      
    this.add.image(400, 300, "sky");

    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setOrigin(0);
    this.bird.body.gravity.y = 400;

    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      let upperPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 1);
      let lowerPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-200);

    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("keydown_SPACE", this.flap, this);
  }

  update() {
  if (this.bird.y >= this.config.height || this.bird.y <= 0 - this.bird.height) {
    this.restartBirdPosition();
  }
  this.recyclePipe();
  }
   placePipe(uPipe, lPipe) {
    let rightMostX = this.getRightMostPipe();
    let pipeVerticalDistance = Phaser.Math.Between(...this.pipeVerticalDistanceRange);
    let pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeVerticalDistance
    );
    let pipeHorizontalDistance = Phaser.Math.Between(
      ...this.pipeHorizontalDistanceRange
    );
  
    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;
  
    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }
   recyclePipe() {
    let tempPipe = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipe.push(pipe);
        if (tempPipe.length === 2) {
          this.placePipe(...tempPipe);
        }
      }
    })
  }
  getRightMostPipe() {
    let rightMostX = 0;
  
    this.pipes.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    });
    return rightMostX;
  }
  restartBirdPosition() {
   this.bird.x = this.config.startPosition.x;
   this.bird.y = this.config.startPosition.y;
   this.bird.body.velocity.y = 0;
  }
  
  flap() {
    this.bird.body.velocity.y = -this.flapVelocity;
  }
}

export default PlayScene;
