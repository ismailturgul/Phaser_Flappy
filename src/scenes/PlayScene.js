import Phaser from 'Phaser';

class PlayScene extends Phaser.Scene {
    constructor(){
        super('PlayScene');
        this.initialBirdPosition = {
            x:80,
            y:300
        }
        this.bird = null;
    }
    preload(){
        this.load.image("sky", "assets/sky.png");
        this.load.image("bird", "assets/bird.png");
        this.load.image("pipe", "assets/pipe.png");
    }
    
    create(){
        this.add.image(config.width / 2, config.height / 2, "sky");
  
        bird = this.physics.add
          .sprite(initialBirdPosition.x, initialBirdPosition.y, "bird")
          .setOrigin(0);
        bird.body.gravity.y = 400;
      
    } 
    
    update(){
    
    } 
}

export default PlayScene