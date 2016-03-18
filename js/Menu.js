var Bomberman = Bomberman || {};

Bomberman.Menu = function(){};

Bomberman.Menu.prototype = {
  create: function(){
    // Add background
    this.background = this.game.add.sprite(0,0,"sprites", "title_background.jpg");
    this.background.width = 600;
    this.background.height = 520;

    // Add title
    this.title = this.game.add.sprite(this.game.width/2, this.game.height/2 - 80, "title");
    this.title.anchor.set(0.5);

    // Preload text
    this.text = this.game.add.text(
        this.game.width/2,
        this.game.height/2 + 80,
        "START GAME",
        {font: "40px monospace", fill: "yellow", align: "center", strokeThickness: 5}
    );
    // Set relative to center, not top left
    this.text.anchor.set(0.5);
    this.text.alpha = 0;

    // Yoyo the text
    this.textFade = this.game.add.tween(this.text).
      to({alpha: 1}, 500, "Linear", true, 1000, -1);

    this.textFade.yoyo(true, 300);

    // Add start button sound
    this.startFx = this.game.add.audio('startGame');
    this.startFx.volume = 2;
  },
  update: function(){
    // If user clicks, start the game
    if(this.game.input.activePointer.justPressed()) {
        this.startFx.play();
        this.game.state.start('Game');
    }
  }
};