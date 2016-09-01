var Bomberman = Bomberman || {};

Bomberman.Stage = function(){};

Bomberman.Stage.prototype = {
  create: function(){
    // Add Tilemap
    this.map = this.game.add.tilemap('stage');
    this.map.addTilesetImage("tiles","tiles");
    this.backgroundLayer = this.map.createLayer("backgroundLayer");
    this.blockLayer = this.map.createLayer("blockLayer");
    this.explosionLayer = this.map.createLayer("explosionLayer");

      // console.log(this.blockLayer.layer);
      // this.map.removeTile(0,1,this.blockLayer);
      // console.log(this.blockLayer.layer.data[0][2].x);
      // console.log(this.blockLayer.layer.data[0][2].y);

    // Set tile collsions
    this.map.setCollision(2, true, this.explosionLayer);
    this.map.setCollision(3, true, this.blockLayer);
  },
  update: function(){
    Bomberman.game.state.start('Game');
  }
};