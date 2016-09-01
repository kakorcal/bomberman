var Bomberman = Bomberman || {};

Bomberman.Preload = function(){};

Bomberman.Preload.prototype = {
  preload: function(){
    // JSON
    this.load.atlasJSONHash("sprites", "/public/assets/sprites/sprites.png", "/public/assets/sprites/sprites.json");
    this.load.tilemap("stage", "/public/assets/tilemaps/stage.json", null, Phaser.Tilemap.TILED_JSON);
    // Images
    this.load.image("tiles", "/public/assets/images/tiles.png");
    this.load.image("title", "/public/assets/images/bomberman.png");
    // Sound Fx
    this.load.audio("startGame", "/public/assets/audio/start.wav");
    this.load.audio("bombExplode", "/public/assets/audio/explode.wav");
    this.load.audio("death", "/public/assets/audio/death.wav");
    this.load.audio("youWin", "/public/assets/audio/you-win.mp3");
    this.load.audio("youLose", "/public/assets/audio/you-lose.mp3");
    // Themes
    this.load.audio("song1", "/public/assets/audio/song1.mp3");
    this.load.audio("song2", "/public/assets/audio/song2.mp3");
    this.load.audio("song3", "/public/assets/audio/song3.mp3");
    this.load.audio("song4", "/public/assets/audio/song4.mp3");
    this.load.audio("song5", "/public/assets/audio/song5.mp3");
    this.load.audio("song6", "/public/assets/audio/song6.mp3");
    this.load.audio("song7", "/public/assets/audio/song7.mp3");
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