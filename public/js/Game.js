var Bomberman = Bomberman || {};

Bomberman.Game = function(){};

Bomberman.Game.prototype = {
  preload: function(){
    // Themes
    this.thm1 = this.game.add.audio('song1');
    this.thm2 = this.game.add.audio('song2');
    this.thm3 = this.game.add.audio('song3');
    this.thm4 = this.game.add.audio('song4');
    this.thm5 = this.game.add.audio('song5');
    this.thm6 = this.game.add.audio('song6');
    this.thm7 = this.game.add.audio('song7');
    // Add Sound Effects
    this.bombFx = this.game.add.audio('bombExplode');
    this.deathFx = this.game.add.audio('death');

    this.thmArr = [].concat(
      this.thm1, this.thm2, this.thm3, this.thm4,
      this.thm5, this.thm6, this.thm7
    );
  },
  create: function(){
    // Play main song
    document.getElementById("start").pause();
    this.thm = this.thmArr[this.game.rnd.integerInRange(0,6)];
    this.thm.volume = 0.8;
    this.thm.loop = true;
    this.thm.play();

    this.bombFx.volume = 2;
    this.deathFx.volume = 2;

    // Win or lose text
    this.endGameMessage = document.getElementById("endGameMessage");

    // Add Tilemap
    this.map = this.game.add.tilemap('stage');
    this.map.addTilesetImage("tiles","tiles");
    this.backgroundLayer = this.map.createLayer("backgroundLayer");
    this.blockLayer = this.map.createLayer("blockLayer");
    this.explosionLayer = this.map.createLayer("explosionLayer");

    // Array of objects with all explosion tile positions
    this.explosionTiles = this.explosionLayer.layer.
    data.map(function(arr){
      return arr.filter(function(tile){
        return tile.index !== -1;
      });
    }).filter(function(arr){
      return arr.length !== 0;
    }).reduce(function(acc,cur){
      return acc.concat(cur);
    },[]).map(function(tile){
      return {
        tileX: tile.x,
        tileY: tile.y,
        worldX: tile.worldX,
        worldY: tile.worldY
      };
    });

    // Set tile collsions
    this.map.setCollision(2, true, this.explosionLayer);
    this.map.setCollision(3, true, this.blockLayer);

    // Add Bomberman and its properties
    this.bman = this.game.add.sprite(40,40,"sprites", "Front/Bman_F_f00.png");
    this.bman.width = 40;
    this.bman.height = 40;
    this.bman.enableBody = true;
    this.game.physics.arcade.enable(this.bman, Phaser.Physics.ARCADE);

    // Add Bomberman Animations
    this.bman.animations.add(
      "moveforward", 
      ["Front/Bman_F_f00.png", "Front/Bman_F_f01.png", "Front/Bman_F_f02.png", 
       "Front/Bman_F_f03.png", "Front/Bman_F_f04.png", 
       "Front/Bman_F_f05.png", "Front/Bman_F_f07.png"],
      10, true, false);

    this.bman.animations.add(
      "moveback", 
      ["Back/Bman_B_f00.png", "Back/Bman_B_f02.png", "Back/Bman_B_f03.png", 
       "Back/Bman_B_f04.png", "Back/Bman_B_f05.png", 
       "Back/Bman_B_f06.png", "Back/Bman_B_f07.png"],
      10, true, false);

    this.bman.animations.add(
      "moveright", 
      ["Side/Bman_F_f00.png", "Side/Bman_F_f01.png", "Side/Bman_F_f02.png", 
       "Side/Bman_F_f03.png", "Side/Bman_F_f04.png", "Side/Bman_F_f05.png",
       "Side/Bman_F_f06.png", "Side/Bman_F_f07.png"],
      10, true, false);

    this.bman.animations.add(
      "moveleft", 
      ["Side/Bman_B_f00.png", "Side/Bman_B_f02.png", "Side/Bman_B_f03.png",
       "Side/Bman_B_f04.png", "Side/Bman_B_f05.png",
       "Side/Bman_B_f06.png", "Side/Bman_B_f07.png"],
      10, true, false);

    // Create Enemy Group
    this.enemies = this.game.add.physicsGroup(Phaser.Physics.ARCADE, this.game.world, "enemies");
    this.enemy1 = this.enemies.create(this.game.world.width-80,40,"sprites","Front/Creep_F_f00.png");
    this.enemy2 = this.enemies.create(40,this.game.world.height-80,"sprites","Front/Creep_F_f00.png");
    this.enemy3 = this.enemies.create(this.game.world.width-80,this.game.world.height-80,"sprites","Front/Creep_F_f00.png");

    // Add properties and animation to each enemy
    this.enemies.hash.forEach(function(enemy){
      enemy.width = 40;
      enemy.height = 40;
      enemy.body.velocity.x = 0;
      enemy.body.velocity.y = 0;
      enemy.animations.add(
        "moveforward",
        ["Front/Creep_F_f00.png", "Front/Creep_F_f01.png", "Front/Creep_F_f02.png",
         "Front/Creep_F_f03.png", "Front/Creep_F_f04.png", "Front/Creep_F_f05.png"], 
        10, true, false
      );
      enemy.animations.add(
        "moveback",
        ["Back/Creep_B_f00.png", "Back/Creep_B_f01.png", "Back/Creep_B_f02.png",
         "Back/Creep_B_f03.png", "Back/Creep_B_f04.png", "Back/Creep_B_f05.png"], 
        10, true, false
      );
      enemy.animations.add(
        "moveright",
        ["Side/Creep_S_f00.png", "Side/Creep_S_f01.png", "Side/Creep_S_f02.png",
         "Side/Creep_S_f03.png", "Side/Creep_S_f04.png",
         "Side/Creep_S_f06.png"], 
        10, true, false
      );
      enemy.animations.add(
        "moveleft",
        ["Side/Creep_B_f00.png", "Side/Creep_B_f01.png", "Side/Creep_B_f02.png",
         "Side/Creep_B_f03.png", "Side/Creep_B_f04.png", "Side/Creep_B_f05.png",
         "Side/Creep_B_f06.png"], 
        10, true, false
      );
    });

    // Initial Enemy AI States
    this.direction = ["N", "W", "E", "S"];
    this.randDirection1 = this.direction[Math.floor(Math.random() * this.direction.length)];
    this.randDirection2 = this.direction[Math.floor(Math.random() * this.direction.length)];
    this.randDirection3 = this.direction[Math.floor(Math.random() * this.direction.length)];
    this.currentDirection1 = "";
    this.currentDirection2 = "";
    this.currentDirection3 = "";

    // Create Bomb Group
    this.bombs = this.game.add.group();
    // Bomb Drop Restrictions + Player ID
    this.droponce = [true, true, true, true]; // = playerIdx

    // Create Flame Group
    this.flames = this.game.add.physicsGroup(Phaser.Physics.ARCADE, this.game.world, "flames");

    // Activate keyboard controls
    this.cursors = this.game.input.keyboard.createCursorKeys();

    // Enable Space Bar Input
    this.spacebar = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    // Enable Play/Pause Song Input
    this.playSong = this.game.input.keyboard.addKey(Phaser.KeyCode.PERIOD);
    this.pauseSong = this.game.input.keyboard.addKey(Phaser.KeyCode.QUESTION_MARK);

    // Pixel gaps between collision layers
    this.gap = [40, 120, 200, 280, 360, 440, 520];

    // Konami Code Shortcut
    this.konamiIdx = 0;
  },
  update: function(){
    // Add Collision Detection For Bomberman
    this.game.physics.arcade.collide(this.bman, this.blockLayer);
    this.game.physics.arcade.collide(this.bman, this.explosionLayer);  
    this.game.physics.arcade.collide(this.bman, this.enemies);
    
    // Bomberman current rounded position
    var bmanX = Math.floor(Math.round(this.bman.position.x / 10) * 10);
    var bmanY = Math.floor(Math.round(this.bman.position.y / 10) * 10);

    //  Reset the bomberman velocity
    this.bman.body.velocity.x = 0;
    this.bman.body.velocity.y = 0;

    // Cursor Triggers
    if(this.cursors.left.isDown){
      //  Move left
      this.gap.forEach(function(num){
        if(bmanY >= num - 10 && bmanY <= num + 10){
          this.bman.position.y = num;
        }
      }, this);

      this.bman.body.velocity.x = -220;
      this.bman.animations.play("moveleft");
    }else if(this.cursors.right.isDown){
      //  Move right
      this.gap.forEach(function(num){
        if(bmanY >= num - 10 && bmanY <= num + 10){
          this.bman.position.y = num;
        }
      }, this);

      this.bman.body.velocity.x = 220;
      this.bman.animations.play("moveright");
    }else if(this.cursors.up.isDown){
      // Move up
      this.gap.forEach(function(num){
        if(bmanX >= num - 10 && bmanX <= num + 10){
          this.bman.position.x = num;
        }
      }, this);

      this.bman.body.velocity.y = -220;
      this.bman.animations.play("moveback");
    }else if(this.cursors.down.isDown){
      // Move down
      this.gap.forEach(function(num){
        if(bmanX >= num - 10 && bmanX <= num + 10){
          this.bman.position.x = num;
        }
      }, this);

      this.bman.body.velocity.y = 220;
      this.bman.animations.play("moveforward");
    }else{
      //  Stand still
      this.bman.animations.stop();         
    }

    // Spacebar Trigger
    if(this.spacebar.isDown && this.droponce[0]){
      // Bomberman current rounded position redefined
      bmanX = Math.floor(Math.round(this.bman.position.x / 10) * 10);
      bmanY = Math.floor(Math.round(this.bman.position.y / 10) * 10);

      // Explosion tiles near Bomberman
      var bmanTilePositions = this.explosionLayer.getTiles(bmanX, bmanY, 40, 40, false, false);
      // Drop tha bomb
      if(bmanTilePositions.length === 1){
        this.dropBomb(bmanTilePositions[0].worldX, bmanTilePositions[0].worldY, 0);
      }else{
        this.dropBomb(bmanTilePositions[1].worldX, bmanTilePositions[1].worldY, 0);        
      }
      // Reset Conditionals
      this.spacebar.isDown = false;
      this.droponce[0] = false;
    }   

    // Enemy AI 
    if(this.enemy1.body !== null){
      // Check collision for explosion + block layers
      this.enemyCollide1 = [this.game.physics.arcade.collide(this.enemy1, this.explosionLayer),
                            this.game.physics.arcade.collide(this.enemy1, this.blockLayer)];

      if(this.enemyCollide1[0] || this.enemyCollide1[1]){
        // If collision occurs, reset the currentDirection of the enemy
        if(this.game.rnd.integerInRange(0,100) === 1){
          this.currentDirection1 = this.direction[Math.floor(Math.random() * this.direction.length)];
        }
      }else if(this.currentDirection1){
        switch(this.currentDirection1){
          case "N":
            this.enemy1.body.velocity.y--;
            this.enemy1.animations.play("moveback");
            break;
          case "W":
            this.enemy1.body.velocity.x--;
            this.enemy1.animations.play("moveleft");
            break;
          case "E":
            this.enemy1.body.velocity.x++;
            this.enemy1.animations.play("moveright");
            break;
          case "S":
            this.enemy1.body.velocity.y++;
            this.enemy1.animations.play("moveforward");
        }
      }else{
        // Initial direction of enemy
        switch(this.randDirection1){
          case "N":
            this.enemy1.body.velocity.y--;
            this.enemy1.animations.play("moveback");
            this.currentDirection1 = this.direction[0];
            break;
          case "W":
            this.enemy1.body.velocity.x--;
            this.enemy1.animations.play("moveleft");
            this.currentDirection1 = this.direction[1];
            break;
          case "E":
            this.enemy1.body.velocity.x++;
            this.enemy1.animations.play("moveright");
            this.currentDirection1 = this.direction[2];
            break;
          case "S":
            this.enemy1.body.velocity.y++;
            this.enemy1.animations.play("moveforward");
            this.currentDirection1 = this.direction[3];
        }
      }

      // Enemy bomb controls
      if(this.game.rnd.integerInRange(0,100) === 1 && this.droponce[1]){
        var enemy1X = Math.floor(Math.round(this.enemy1.position.x / 10) * 10);
        var enemy1Y = Math.floor(Math.round(this.enemy1.position.y / 10) * 10);
        var enemy1TilePositions = this.explosionLayer.getTiles(enemy1X, enemy1Y, 40, 40, false, false);
        if(enemy1TilePositions.length === 1){
          this.dropBomb(enemy1TilePositions[0].worldX, enemy1TilePositions[0].worldY, 1);
        }else{
          this.dropBomb(enemy1TilePositions[1].worldX, enemy1TilePositions[1].worldY, 1);        
        }
        this.droponce[1] = false;
      }
    }

    if(this.enemy2.body !== null){
      // Check collision for explosion + block layers
      this.enemyCollide2 = [this.game.physics.arcade.collide(this.enemy2, this.explosionLayer),
                            this.game.physics.arcade.collide(this.enemy2, this.blockLayer)];

      if(this.enemyCollide2[0] || this.enemyCollide2[1]){
        // If collision occurs, reset the currentDirection of the enemy
        if(this.game.rnd.integerInRange(0,100) === 1){
          this.currentDirection2 = this.direction[Math.floor(Math.random() * this.direction.length)];
        }
      }else if(this.currentDirection2){
        switch(this.currentDirection2){
          case "N":
            this.enemy2.body.velocity.y--;
            this.enemy2.animations.play("moveback");
            break;
          case "W":
            this.enemy2.body.velocity.x--;
            this.enemy2.animations.play("moveleft");
            break;
          case "E":
            this.enemy2.body.velocity.x++;
            this.enemy2.animations.play("moveright");
            break;
          case "S":
            this.enemy2.body.velocity.y++;
            this.enemy2.animations.play("moveforward");
        }
      }else{
        // Initial direction of enemy
        switch(this.randDirection2){
          case "N":
            this.enemy2.body.velocity.y--;
            this.enemy2.animations.play("moveback");
            this.currentDirection2 = this.direction[0];
            break;
          case "W":
            this.enemy2.body.velocity.x--;
            this.enemy2.animations.play("moveleft");
            this.currentDirection2 = this.direction[1];
            break;
          case "E":
            this.enemy2.body.velocity.x++;
            this.enemy2.animations.play("moveright");
            this.currentDirection2 = this.direction[2];
            break;
          case "S":
            this.enemy2.body.velocity.y++;
            this.enemy2.animations.play("moveforward");
            this.currentDirection2 = this.direction[3];
        }
      }

      // Enemy bomb controls
      if(this.game.rnd.integerInRange(0,100) === 1 && this.droponce[2]){
        var enemy2X = Math.floor(Math.round(this.enemy2.position.x / 10) * 10);
        var enemy2Y = Math.floor(Math.round(this.enemy2.position.y / 10) * 10);
        var enemy2TilePositions = this.explosionLayer.getTiles(enemy2X, enemy2Y, 40, 40, false, false);
        if(enemy2TilePositions.length === 1){
          this.dropBomb(enemy2TilePositions[0].worldX, enemy2TilePositions[0].worldY, 2);
        }else{
          this.dropBomb(enemy2TilePositions[1].worldX, enemy2TilePositions[1].worldY, 2);        
        }
        this.droponce[2] = false;
      }
    }

    if(this.enemy3.body !== null){
      // Check collision for explosion + block layers
      this.enemyCollide3 = [this.game.physics.arcade.collide(this.enemy3, this.explosionLayer),
                            this.game.physics.arcade.collide(this.enemy3, this.blockLayer)];

      if(this.enemyCollide3[0] || this.enemyCollide3[1]){
        // If collision occurs, reset the currentDirection of the enemy
        if(this.game.rnd.integerInRange(0,100) === 1){
          this.currentDirection3 = this.direction[Math.floor(Math.random() * this.direction.length)];
        }
      }else if(this.currentDirection3){
        switch(this.currentDirection3){
          case "N":
            this.enemy3.body.velocity.y--;
            this.enemy3.animations.play("moveback");
            break;
          case "W":
            this.enemy3.body.velocity.x--;
            this.enemy3.animations.play("moveleft");
            break;
          case "E":
            this.enemy3.body.velocity.x++;
            this.enemy3.animations.play("moveright");
            break;
          case "S":
            this.enemy3.body.velocity.y++;
            this.enemy3.animations.play("moveforward");
        }
      }else{
        // Initial direction of enemy
        switch(this.randDirection3){
          case "N":
            this.enemy3.body.velocity.y--;
            this.enemy3.animations.play("moveback");
            this.currentDirection3 = this.direction[0];
            break;
          case "W":
            this.enemy3.body.velocity.x--;
            this.enemy3.animations.play("moveleft");
            this.currentDirection3 = this.direction[1];
            break;
          case "E":
            this.enemy3.body.velocity.x++;
            this.enemy3.animations.play("moveright");
            this.currentDirection3 = this.direction[2];
            break;
          case "S":
            this.enemy3.body.velocity.y++;
            this.enemy3.animations.play("moveforward");
            this.currentDirection3 = this.direction[3];
        }
      }

      // Enemy bomb controls
      if(this.game.rnd.integerInRange(0,100) === 1 && this.droponce[3]){
        var enemy3X = Math.floor(Math.round(this.enemy3.position.x / 10) * 10);
        var enemy3Y = Math.floor(Math.round(this.enemy3.position.y / 10) * 10);
        var enemy3TilePositions = this.explosionLayer.getTiles(enemy3X, enemy3Y, 40, 40, false, false);
        if(enemy3TilePositions.length === 1){
          this.dropBomb(enemy3TilePositions[0].worldX, enemy3TilePositions[0].worldY, 3);
        }else{
          this.dropBomb(enemy3TilePositions[1].worldX, enemy3TilePositions[1].worldY, 3);        
        }
        this.droponce[3] = false;
      }
    }

    // Check enemies state
    if(this.enemies.children.length === 0){
      // Goto End state if all enemies died
      this.thm.pause();
      this.endGameMessage.innerText = "YOU WIN";
      this.state.start("End");
      console.log("All enemies destroyed");
    }

    // Play/Pause Triggers
    if(this.pauseSong.isDown){
      this.thm.pause();
    }
    if(this.playSong.isDown){
      this.thm.resume();
    }

    // Keyboard Callback
    this.game.input.keyboard.onDownCallback = function(){        
      if(konamiCheck(this.game.input.keyboard.event.keyCode)){
        this.thm.pause();
        this.endGameMessage.innerText = "YOU WIN";
        this.state.start("End");
        console.log("YOU ARE AN EVENT HANDLER GURUUUUUUUUU!");
      }      
    }.bind(this);
  },
  dropBomb: function(posX, posY, playerIdx){
    // Create bomb and bomb animations
    switch(playerIdx){
      case 0: 
        this.bomb0 = this.bombs.create(posX, posY, "sprites", "Bomb_f01.png");
        this.bomb0.width = 40;
        this.bomb0.height = 40;

        this.bomb0.animations.add(
          "dropbomb0",
          ["Bomb_f01.png", "Bomb_f02.png", "Bomb_f03.png", 
           "Bomb_f01.png", "Bomb_f02.png", "Bomb_f03.png",
           "Bomb_f01.png", "Bomb_f02.png"],
          2, false, false
        );
        this.bomb0.animations.play("dropbomb0");

        // Destroy bomb after animation loop completes
        this.bomb0.events.onAnimationComplete.add(function(){
          this.explode(posX, posY, playerIdx);
          this.bomb0.destroy();
          this.bombFx.play();
          this.droponce[playerIdx] = true;
          console.log("bomb animation complete");
        }, this);
      break;
      case 1: 
        this.bomb1 = this.bombs.create(posX, posY, "sprites", "Bomb_f01.png");
        this.bomb1.width = 40;
        this.bomb1.height = 40;
        this.bomb1.animations.add(
          "dropbomb1",
          ["Bomb_f01.png", "Bomb_f02.png", "Bomb_f03.png", 
           "Bomb_f01.png", "Bomb_f02.png", "Bomb_f03.png",
           "Bomb_f01.png", "Bomb_f02.png"],
          2, false, false
        );
        this.bomb1.animations.play("dropbomb1");
        // Destroy bomb after animation loop completes
        this.bomb1.events.onAnimationComplete.add(function(){
          this.explode(posX, posY, playerIdx);
          this.bomb1.destroy();
          this.bombFx.play();
          this.droponce[playerIdx] = true;
          console.log("bomb animation complete");
        }, this);
      break;
      case 2: 
        this.bomb2 = this.bombs.create(posX, posY, "sprites", "Bomb_f01.png");
        this.bomb2.width = 40;
        this.bomb2.height = 40;
        this.bomb2.animations.add(
          "dropbomb2",
          ["Bomb_f01.png", "Bomb_f02.png", "Bomb_f03.png", 
           "Bomb_f01.png", "Bomb_f02.png", "Bomb_f03.png",
           "Bomb_f01.png", "Bomb_f02.png"],
          2, false, false
        );
        this.bomb2.animations.play("dropbomb2");
        // Destroy bomb after animation loop completes
        this.bomb2.events.onAnimationComplete.add(function(){
          this.explode(posX, posY, playerIdx);
          this.bomb2.destroy();
          this.bombFx.play();
          this.droponce[playerIdx] = true;
          console.log("bomb animation complete");
        }, this);
      break;
      case 3: 
        this.bomb3 = this.bombs.create(posX, posY, "sprites", "Bomb_f01.png");
        this.bomb3.width = 40;
        this.bomb3.height = 40;
        this.bomb3.animations.add(
          "dropbomb3",
          ["Bomb_f01.png", "Bomb_f02.png", "Bomb_f03.png", 
           "Bomb_f01.png", "Bomb_f02.png", "Bomb_f03.png",
           "Bomb_f01.png", "Bomb_f02.png"],
          2, false, false
        );
        this.bomb3.animations.play("dropbomb3");
        // Destroy bomb after animation loop completes
        this.bomb3.events.onAnimationComplete.add(function(){
          this.explode(posX, posY, playerIdx);
          this.bomb3.destroy();
          this.bombFx.play();
          this.droponce[playerIdx] = true;
          console.log("bomb animation complete");
        }, this);
      break;
    }
  },
  explode: function(bombX, bombY, playerIdx){
    // Create flames and animation
    switch(playerIdx){
      case 0: 
        this.flame00 = this.flames.create(bombX, bombY, "sprites", "Flame_f00.png");
        this.flame00.width = 40;
        this.flame00.height = 40;
        this.flame00.animations.add(
          "explode00",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );

        this.flame01 = this.flames.create(bombX - 40, bombY, "sprites", "Flame_f00.png");
        this.flame01.width = 40;
        this.flame01.height = 40;
        this.flame01.animations.add(
          "explode01",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );

        this.flame02 = this.flames.create(bombX + 40, bombY, "sprites", "Flame_f00.png");
        this.flame02.width = 40;
        this.flame02.height = 40;
        this.flame02.animations.add(
          "explode02",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );

        this.flame03 = this.flames.create(bombX, bombY - 40, "sprites", "Flame_f00.png");
        this.flame03.width = 40;
        this.flame03.height = 40;
        this.flame03.animations.add(
          "explode03",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );

        this.flame04 = this.flames.create(bombX, bombY + 40, "sprites", "Flame_f00.png");
        this.flame04.width = 40;
        this.flame04.height = 40;
        this.flame04.animations.add(
          "explode04",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );

        this.flame00.animations.play("explode00");
        this.flame01.animations.play("explode01");
        this.flame02.animations.play("explode02");
        this.flame03.animations.play("explode03");
        this.flame04.animations.play("explode04");
        
        // Destroy flame after animation loop completes
        this.flame00.events.onAnimationComplete.add(function(){
          // Remove explosive tiles if they are in range of flame
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX && tile.worldY === bombY){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          // Kill Bomberman if its in range of flame
          this.game.physics.arcade.overlap(this.flame00, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);

          this.game.physics.arcade.overlap(this.flame00, this.enemy1, function(){
            // Play enemy death song
            this.deathFx.play();
            // Fade the enemy
            this.fade1 = this.game.add.tween(this.enemy1).
              to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            // Kill enemy after callback
            this.fade1.onComplete.add(function(){
              this.enemy1.destroy();
            }, this);
            console.log("enemy collision detected");
          }, null, this);

          this.game.physics.arcade.overlap(this.flame00, this.enemy2, function(){
            // Play enemy death song
            this.deathFx.play();
            // Fade the enemy
            this.fade2 = this.game.add.tween(this.enemy2).
              to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            // Kill enemy after callback
            this.fade2.onComplete.add(function(){
              this.enemy2.destroy();
            }, this);
            console.log("enemy collision detected");
          }, null, this);

          this.game.physics.arcade.overlap(this.flame00, this.enemy3, function(){
            // Play enemy death song
            this.deathFx.play();
            // Fade the enemy
            this.fade3 = this.game.add.tween(this.enemy3).
              to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            // Kill enemy after callback
            this.fade3.onComplete.add(function(){
              this.enemy3.destroy();
            }, this);
            console.log("enemy collision detected");
          }, null, this);
          this.flame00.destroy();
        }, this);

        this.flame01.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX - 40 && tile.worldY === bombY){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame01, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);

          this.game.physics.arcade.overlap(this.flame01, this.enemy1, function(){
            // Play enemy death song
            this.deathFx.play();
            // Fade the enemy
            this.fade1 = this.game.add.tween(this.enemy1).
              to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            // Kill enemy after callback
            this.fade1.onComplete.add(function(){
              this.enemy1.destroy();
            }, this);
            console.log("enemy collision detected");
          }, null, this);

          this.game.physics.arcade.overlap(this.flame01, this.enemy2, function(){
            // Play enemy death song
            this.deathFx.play();
            // Fade the enemy
            this.fade2 = this.game.add.tween(this.enemy2).
              to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            // Kill enemy after callback
            this.fade2.onComplete.add(function(){
              this.enemy2.destroy();
            }, this);
            console.log("enemy collision detected");
          }, null, this);

          this.game.physics.arcade.overlap(this.flame01, this.enemy3, function(){
            // Play enemy death song
            this.deathFx.play();
            // Fade the enemy
            this.fade3 = this.game.add.tween(this.enemy3).
              to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            // Kill enemy after callback
            this.fade3.onComplete.add(function(){
              this.enemy3.destroy();
            }, this);
            console.log("enemy collision detected");
          }, null, this);
          this.flame01.destroy();
        }, this);

        this.flame02.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX + 40 && tile.worldY === bombY){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame02, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);

          this.game.physics.arcade.overlap(this.flame02, this.enemy1, function(){
            // Play enemy death song
            this.deathFx.play();
            // Fade the enemy
            this.fade1 = this.game.add.tween(this.enemy1).
              to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            // Kill enemy after callback
            this.fade1.onComplete.add(function(){
              this.enemy1.destroy();
            }, this);
            console.log("enemy collision detected");
          }, null, this);

          this.game.physics.arcade.overlap(this.flame02, this.enemy2, function(){
            // Play enemy death song
            this.deathFx.play();
            // Fade the enemy
            this.fade2 = this.game.add.tween(this.enemy2).
              to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            // Kill enemy after callback
            this.fade2.onComplete.add(function(){
              this.enemy2.destroy();
            }, this);
            console.log("enemy collision detected");
          }, null, this);

          this.game.physics.arcade.overlap(this.flame02, this.enemy3, function(){
            // Play enemy death song
            this.deathFx.play();
            // Fade the enemy
            this.fade3 = this.game.add.tween(this.enemy3).
              to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            // Kill enemy after callback
            this.fade3.onComplete.add(function(){
              this.enemy3.destroy();
            }, this);
            console.log("enemy collision detected");
          }, null, this);

          this.flame02.destroy();
        }, this);
        this.flame03.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX && tile.worldY === bombY - 40){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame03, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);

          this.game.physics.arcade.overlap(this.flame03, this.enemy1, function(){
            // Play enemy death song
            this.deathFx.play();
            // Fade the enemy
            this.fade1 = this.game.add.tween(this.enemy1).
              to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            // Kill enemy after callback
            this.fade1.onComplete.add(function(){
              this.enemy1.destroy();
            }, this);
            console.log("enemy collision detected");
          }, null, this);

          this.game.physics.arcade.overlap(this.flame03, this.enemy2, function(){
            // Play enemy death song
            this.deathFx.play();
            // Fade the enemy
            this.fade2 = this.game.add.tween(this.enemy2).
              to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            // Kill enemy after callback
            this.fade2.onComplete.add(function(){
              this.enemy2.destroy();
            }, this);
            console.log("enemy collision detected");
          }, null, this);

          this.game.physics.arcade.overlap(this.flame03, this.enemy3, function(){
            // Play enemy death song
            this.deathFx.play();
            // Fade the enemy
            this.fade3 = this.game.add.tween(this.enemy3).
              to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            // Kill enemy after callback
            this.fade3.onComplete.add(function(){
              this.enemy3.destroy();
            }, this);
            console.log("enemy collision detected");
          }, null, this);
          this.flame03.destroy();
        }, this);

        this.flame04.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX && tile.worldY === bombY + 40){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame04, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);

          this.game.physics.arcade.overlap(this.flame04, this.enemy1, function(){
            // Play enemy death song
            this.deathFx.play();
            // Fade the enemy
            this.fade1 = this.game.add.tween(this.enemy1).
              to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            // Kill enemy after callback
            this.fade1.onComplete.add(function(){
              this.enemy1.destroy();
            }, this);
            console.log("enemy collision detected");
          }, null, this);

          this.game.physics.arcade.overlap(this.flame04, this.enemy2, function(){
            // Play enemy death song
            this.deathFx.play();
            // Fade the enemy
            this.fade2 = this.game.add.tween(this.enemy2).
              to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            // Kill enemy after callback
            this.fade2.onComplete.add(function(){
              this.enemy2.destroy();
            }, this);
            console.log("enemy collision detected");
          }, null, this);

          this.game.physics.arcade.overlap(this.flame04, this.enemy3, function(){
            // Play enemy death song
            this.deathFx.play();
            // Fade the enemy
            this.fade3 = this.game.add.tween(this.enemy3).
              to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            // Kill enemy after callback
            this.fade3.onComplete.add(function(){
              this.enemy3.destroy();
            }, this);
            console.log("enemy collision detected");
          }, null, this);

          this.flame04.destroy();
          console.log("flame animation complete");
        }, this);
      break;
      case 1:
        this.flame10 = this.flames.create(bombX, bombY, "sprites", "Flame_f00.png");
        this.flame10.width = 40;
        this.flame10.height = 40;
        this.flame10.animations.add(
          "explode10",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );

        this.flame11 = this.flames.create(bombX - 40, bombY, "sprites", "Flame_f00.png");
        this.flame11.width = 40;
        this.flame11.height = 40;
        this.flame11.animations.add(
          "explode11",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );

        this.flame12 = this.flames.create(bombX + 40, bombY, "sprites", "Flame_f00.png");
        this.flame12.width = 40;
        this.flame12.height = 40;
        this.flame12.animations.add(
          "explode12",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );


        this.flame13 = this.flames.create(bombX, bombY - 40, "sprites", "Flame_f00.png");
        this.flame13.width = 40;
        this.flame13.height = 40;
        this.flame13.animations.add(
          "explode13",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );

        this.flame14 = this.flames.create(bombX, bombY + 40, "sprites", "Flame_f00.png");
        this.flame14.width = 40;
        this.flame14.height = 40;
        this.flame14.animations.add(
          "explode14",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );

        this.flame10.animations.play("explode10");
        this.flame11.animations.play("explode11");
        this.flame12.animations.play("explode12");
        this.flame13.animations.play("explode13");
        this.flame14.animations.play("explode14");
        
        // Destroy flame after animation loop completes
        this.flame10.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX && tile.worldY === bombY){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame10, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);

          this.flame10.destroy();
        }, this);
        this.flame11.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX - 40 && tile.worldY === bombY){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame11, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);

          this.flame11.destroy();
        }, this);
        this.flame12.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX + 40 && tile.worldY === bombY){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame12, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);

          this.flame12.destroy();
        }, this);
        this.flame13.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX && tile.worldY === bombY - 40){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame13, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);

          this.flame13.destroy();
        }, this);
        this.flame14.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX && tile.worldY === bombY + 40){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame14, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);
          this.flame14.destroy();
          console.log("flame animation complete");
        }, this);
      break;
      case 2:
        this.flame20 = this.flames.create(bombX, bombY, "sprites", "Flame_f00.png");
        this.flame20.width = 40;
        this.flame20.height = 40;
        this.flame20.animations.add(
          "explode20",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );

        this.flame21 = this.flames.create(bombX - 40, bombY, "sprites", "Flame_f00.png");
        this.flame21.width = 40;
        this.flame21.height = 40;
        this.flame21.animations.add(
          "explode21",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );

        this.flame22 = this.flames.create(bombX + 40, bombY, "sprites", "Flame_f00.png");
        this.flame22.width = 40;
        this.flame22.height = 40;
        this.flame22.animations.add(
          "explode22",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );


        this.flame23 = this.flames.create(bombX, bombY - 40, "sprites", "Flame_f00.png");
        this.flame23.width = 40;
        this.flame23.height = 40;
        this.flame23.animations.add(
          "explode23",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );

        this.flame24 = this.flames.create(bombX, bombY + 40, "sprites", "Flame_f00.png");
        this.flame24.width = 40;
        this.flame24.height = 40;
        this.flame24.animations.add(
          "explode24",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );

        this.flame20.animations.play("explode20");
        this.flame21.animations.play("explode21");
        this.flame22.animations.play("explode22");
        this.flame23.animations.play("explode23");
        this.flame24.animations.play("explode24");
        
        // Destroy flame after animation loop completes
        this.flame20.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX && tile.worldY === bombY){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame20, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);

          this.flame20.destroy();
        }, this);
        this.flame21.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX - 40 && tile.worldY === bombY){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame21, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);

          this.flame21.destroy();
        }, this);
        this.flame22.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX + 40 && tile.worldY === bombY){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame22, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);

          this.flame22.destroy();
        }, this);
        this.flame23.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX && tile.worldY === bombY - 40){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame23, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);

          this.flame23.destroy();
        }, this);
        this.flame24.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX && tile.worldY === bombY + 40){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame24, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);
          this.flame24.destroy();
          console.log("flame animation complete");
        }, this);
      break;
      case 3:
        this.flame30 = this.flames.create(bombX, bombY, "sprites", "Flame_f00.png");
        this.flame30.width = 40;
        this.flame30.height = 40;
        this.flame30.animations.add(
          "explode30",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );

        this.flame31 = this.flames.create(bombX - 40, bombY, "sprites", "Flame_f00.png");
        this.flame31.width = 40;
        this.flame31.height = 40;
        this.flame31.animations.add(
          "explode31",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );

        this.flame32 = this.flames.create(bombX + 40, bombY, "sprites", "Flame_f00.png");
        this.flame32.width = 40;
        this.flame32.height = 40;
        this.flame32.animations.add(
          "explode32",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );


        this.flame33 = this.flames.create(bombX, bombY - 40, "sprites", "Flame_f00.png");
        this.flame33.width = 40;
        this.flame33.height = 40;
        this.flame33.animations.add(
          "explode33",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );

        this.flame34 = this.flames.create(bombX, bombY + 40, "sprites", "Flame_f00.png");
        this.flame34.width = 40;
        this.flame34.height = 40;
        this.flame34.animations.add(
          "explode34",
          ["Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png", 
           "Flame_f00.png", "Flame_f01.png", "Flame_F02.png", "Flame_F03.png", "Flame_F04.png"],
          20, false, false
        );

        this.flame30.animations.play("explode30");
        this.flame31.animations.play("explode31");
        this.flame32.animations.play("explode32");
        this.flame33.animations.play("explode33");
        this.flame34.animations.play("explode34");
        
        // Destroy flame after animation loop completes
        this.flame30.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX && tile.worldY === bombY){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame30, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);

          this.flame30.destroy();
        }, this);
        this.flame31.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX - 40 && tile.worldY === bombY){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame31, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);

          this.flame31.destroy();
        }, this);
        this.flame32.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX + 40 && tile.worldY === bombY){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame32, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);

          this.flame32.destroy();
        }, this);
        this.flame33.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX && tile.worldY === bombY - 40){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame33, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);

          this.flame33.destroy();
        }, this);
        this.flame34.events.onAnimationComplete.add(function(){
          this.explosionTiles.forEach(function(tile){
            if(tile.worldX === bombX && tile.worldY === bombY + 40){
              this.map.removeTile(tile.tileX, tile.tileY, this.explosionLayer);
            }
          }, this);

          this.game.physics.arcade.overlap(this.flame34, this.bman, function(){
            this.thm.pause();
            this.endGameMessage.innerText = "YOU LOSE";
            this.state.start("End");
            console.log("bomberman collision detected");
          }, null, this);
          this.flame34.destroy();
          console.log("flame animation complete");
        }, this);
      break;
    }
  }
};