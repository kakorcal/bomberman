var Bomberman = Bomberman || {};

Bomberman.End = function(){};

Bomberman.End.prototype = {
  preload: function(){
    this.win = this.game.add.audio("youWin");
    this.lose = this.game.add.audio("youLose");
  }, 
  create: function(){
    var endGameMessage = document.getElementById("endGameMessage").innerText;
    this.endgame = this.game.add.text(
        this.game.width/2,
        this.game.height/2 - 80,
        "GAME OVER" + "\n" + endGameMessage,
        {font: "60px monospace", fill: "yellow", align: "center", strokeThickness: 5}
    );
    this.playAgain = this.game.add.text(
        this.game.width/2,
        this.game.height/2 + 40,
        "PLAY AGAIN?",
        {font: "40px monospace", fill: "#6399D1", align: "center", strokeThickness: 5}
    );

    // Set relative to center, not top left
    this.endgame.anchor.set(0.5);
    this.playAgain.anchor.set(0.5);
    this.playAgain.alpha = 0;
    this.game.stage.backgroundColor = "#000";

    // Yoyo the text
    this.textFade = this.game.add.tween(this.playAgain).
      to({alpha: 1}, 500, "Linear", true, 1000, -1);

    this.textFade.yoyo(true, 300);

    // Add start button sound
    this.startFx = this.game.add.audio('startGame');
    this.startFx.volume = 2;

    // Play ending song
    if(endGameMessage === "YOU WIN"){
      this.win.play();
    }else{
      this.lose.play();
    }
  },
  update: function(){
    // If user clicks, start the game
    if(this.game.input.activePointer.justPressed()) {
        this.startFx.play();
        this.game.state.start('Game');
    }
  }
};