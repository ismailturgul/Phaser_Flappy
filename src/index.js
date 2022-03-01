import Phaser, { UP } from "phaser";
import PlayScene from "./scenes/PlayScene";
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {},
  },
  scene: [PlayScene];
}
function preload() {
  this.load.image("pipe", "assets/pipe.png");
}

const VELOCITY = 200;
const PIPES_TO_RENDER = 2;
let bird = null;
let pipes = null;
let flapVelocity = 250;
let pipeHorizontalDistance = 0; 
let pipeVerticalDistanceRange = [150, 250];
let pipeHorizontalDistanceRange = [400,500]; 

const initialBirdPosition = { x: config.width / 10, y: config.height / 2 };


function create() {
  this.add.image(config.width / 2, config.height / 2, "sky");
  
  bird = this.physics.add
    .sprite(initialBirdPosition.x, initialBirdPosition.y, "bird")
    .setOrigin(0);
  bird.body.gravity.y = 400;

  pipes = this.physics.add.group();

  for (let i = 0; i < PIPES_TO_RENDER; i++){
    let upperPipe = pipes.create(0, 0, "pipe").setOrigin(0, 1);
    let lowerPipe = pipes.create(0, 0, "pipe").setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe);
  }

  pipes.setVelocityX(-200);

  this.input.on("pointerdown", flap);
  this.input.keyboard.on("keydown_SPACE", flap);
}


function update(time, delta) {
    // movement innerhalb horizontal canvas
    if (bird.y >= config.height || bird.y <= 0 - bird.height) {
      restartBirdPosition();
    }
    recyclePipe()
  
}

function placePipe(uPipe, lPipe){
   
  let rightMostX = getRightMostPipe();
  let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange)
  let pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height - 20 - pipeVerticalDistance);
  let pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange); 
  
  uPipe.x = rightMostX + pipeHorizontalDistance
  uPipe.y = pipeVerticalPosition

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;
}
function recyclePipe(){

    let tempPipe = [];
    pipes.getChildren().forEach(pipe => {
   
    if (pipe.getBounds().right <= 0){
      tempPipe.push(pipe);
      if (tempPipe.length === 2){
        placePipe(...tempPipe);
      }
    }
  })
}

function getRightMostPipe(){
  let rightMostX = 0;

  pipes.getChildren().forEach(function(pipe){
    rightMostX = Math.max(pipe.x, rightMostX);

  })  
  return rightMostX;
}


function restartBirdPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}

new Phaser.Game(config);
