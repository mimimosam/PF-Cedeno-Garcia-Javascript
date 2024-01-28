import './style.css'
import Phaser from 'phaser'
import * as Swal from 'sweetalert2'

window.Swal = Swal

let startBtn = document.querySelector('#startBtn');
let instructionsBtn = document.querySelector ('#instructionsBtn');

const sizes = {
  width: 570,
  height: 320
}

const speedDown = 300;
const speedCoins = 350;

// Game Consructor

class GameScene extends Phaser.Scene {
  constructor () {
    super("scene-game")
    this.player;
    this.cursors;
    this.playerSpeed = speedDown + 100;
    this.target;
    this.points = 0;
    this.textScore;
    this.textTime;
    this.timedEvent;
    this.remainingTime;
    this.emitter;
  }

  //Pre lading game assets
  preload (){
    this.load.image ("bg", "./public/assets/background1.png");
    this.load.image ("player", "./public/assets/mushroomp.png");
    this.load.image ("coin", "./public/assets/coin.png");
    this.load.image ("money", "./public/assets/money.png");
  }

  //creating game functions
  create (){
    this.scene.pause("scene-game")

    //Adding player
    this.add.image (0,0,"bg").setOrigin(0,0);
    this.player = this.physics.add.image (sizes.width-300,sizes.height-100,"player").setOrigin(0,0);
    this.player.setImmovable (true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);

    //Adding coins
    this.target = this.physics.add.image (0,0,"coin").setOrigin(0,0);
    this.target.setMaxVelocity(0, speedCoins);

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this);

    //Key bindings using Phaser 
    this.cursors = this.input.keyboard.createCursorKeys();

    //Display of Score
    this.textScore = this.add.text(sizes.width - 100, 10, "Score:0", {
      font: "20px Kolledif",
      fill: "#000000",
    });

    //Display of timer
    this.textTime = this.add.text(20,10, "Remaining Time: 00", {
      font: "20px Kolledif",
      fill: "#000000",
    })

    //Timer
    this.timedEvent = this.time.delayedCall (20000, this.gameOver, [], this);

    //Particles emitter - when colliding with target
    this.emitter = this.add.particles(0,0, "coin", {
      speed: 150,
      gravityY:speedDown-50,
      scale: 0.5,
      duration: 50,
      emitting: false
    })
    this.emitter.startFollow(this.player, this.player.width / 2, this.player.height / 2, true);
  }


  //Updating statuses during game
  update (){
    //Timer update
    this.remainingTime = this.timedEvent.getRemainingSeconds()
    this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime).toString()}`)

    if (this.target.y >= sizes.height) {
      this.target.setY (0);
      this.target.setX (this.getRandomX());
    }

    //Key bindings update
    const {left, right} = this.cursors;

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    }
    else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed); 
    }
    else {
      this.player.setVelocityX(0) 
    }
  }

  //Random coin spawning
  getRandomX () {
    return Math.floor(Math.random() * 480);
  }

  //Function when coins hit player
  targetHit (){
    this.target.setY (0);
    this.emitter.start();
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText(`Score: ${this.points}`)
  }

  //Game over screen
  gameOver () {
    this.sys.game.scene.destroy(true)
    Swal.fire ({
      title: "Congratulations!",
      text: `Your final score is ${this.points}. Refresh the page to play again.`,
      timer: 7000,
      timerProgressBar: true,
      confirmButtonColor: "#49111C",
    })
  }
}

const config ={
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {y:speedDown},
      debug: true
    }
  },
  scene: [GameScene]
}

const game = new Phaser.Game (config);

//Instructions button 
instructionsBtn.onclick = () => {
  Swal.fire ({
      text: "Move the sprite using the arrow keys. Collect coins before the timer runs out!",
      confirmButtonText: "Accept",
      confirmButtonColor: "#49111C",
  })
}

//Start button
startBtn.onclick = () => {
  Swal.fire ({
      text: "Please write your name",
      confirmButtonText: "Start",
      confirmButtonColor: "#49111C",
      input: "text",
  }).then (answer => {
      if (answer.isConfirmed) {
          Swal.fire ({
              text: "Welcome " + answer.value + ". You can start moving now!",
              confirmButtonColor: "#49111C",
          }).then (answer2 => {
              if (answer2.isConfirmed) {
                  localStorage.setItem("playerName", JSON.stringify(answer));
                  localStorage.getItem('playerName');
                  game.scene.resume("scene-game");
              }
          })
      }
})
}