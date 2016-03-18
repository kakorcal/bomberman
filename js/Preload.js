var Bomberman = Bomberman || {};

Bomberman.Preload = function(){};

Bomberman.Preload.prototype = {
  preload: function(){
    // JSON
    this.load.atlasJSONHash("sprites", "assets/sprites/sprites.png", "assets/sprites/sprites.json");
    this.load.tilemap("stage", "assets/tilemaps/stage.json", null, Phaser.Tilemap.TILED_JSON);
    // Images
    this.load.image("tiles", "assets/images/tiles.png");
    this.load.image("title", "assets/images/bomberman.png");
    // Sound Fx
    this.load.audio("startGame", "assets/audio/start.wav");
    this.load.audio("bombExplode", "assets/audio/explode.wav");
    this.load.audio("death", "assets/audio/death.wav");
    this.load.audio("youWin", "assets/audio/you-win.mp3");
    this.load.audio("youLose", "assets/audio/you-lose.mp3");
    // Themes
    this.load.audio("song1", "assets/audio/song1.mp3");
    this.load.audio("song2", "assets/audio/song2.mp3");
    this.load.audio("song3", "assets/audio/song3.mp3");
    this.load.audio("song4", "assets/audio/song4.mp3");
    this.load.audio("song5", "assets/audio/song5.mp3");
    this.load.audio("song6", "assets/audio/song6.mp3");
    this.load.audio("song7", "assets/audio/song7.mp3");
  },
  create: function(){
    // Start First Song
    document.getElementById("start").play();
    // Add basic physics methods
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    // Set gravity to 0 just in case
    this.game.physics.arcade.gravity.y = 0;
    // Start the Menu state
    this.state.start("Menu");
  } 
};