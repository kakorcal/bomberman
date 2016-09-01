var Bomberman = Bomberman || {};

Bomberman.Boot = function(){};

Bomberman.Boot.prototype = {
  create: function(){
    // Preload text
    this.text = this.game.add.text(
        this.game.width/2,
        this.game.height/2,
        "LOADING...",
        {font: "40px monospace", fill: "yellow", align: "center", strokeThickness: 5}
    );
    // Set relative to center, not top left
    this.text.anchor.set(0.5);
    this.text.alpha = 0;

    // Yoyo the text
    this.textFade = this.game.add.tween(this.text).
      to({alpha: 1}, 0, "Linear", true, 1000, -1);

    this.textFade.yoyo(true, 300);
    // Start the Preload state
    this.state.start("Preload"); 
  }
};
